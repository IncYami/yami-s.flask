from flask import Flask, render_template
import os
import markdown
import re
import requests
import json
from datetime import datetime

app = Flask(__name__)

def parse_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Estrutura para armazenar as informações
    anime_info = {
        'name': "Nome Desconhecido",
        'AnilistID': None,
        'date': "",
        'torrent': "",
        'magnet': "",
        'cloud': "",
        'has_changelog': False,
        'changelog': "",
        'info': "",
        'files': "",
        'image_url': None,
        'banner_url': None,
        'last_update': None,
        'releasing': False,
        'batch': False,
        'rev': False,
        'planning': False,
        'files_with_links': []
    }
    
    # Extrair seção de metadados
    metadata_match = re.search(r'===Metadata\s*(.*?)===', content, re.DOTALL)
    if metadata_match:
        metadata_text = metadata_match.group(1).strip()
        
        # Extrair campos específicos dos metadados
        anime_match = re.search(r'Anime:\s*(.*)', metadata_text)
        AnilistID_match = re.search(r'AnilistID:\s*(.*)', metadata_text)
        date_match = re.search(r'Date:\s*(.*)', metadata_text)
        torrent_match = re.search(r'Torrent:\s*(.*)', metadata_text)
        magnet_match = re.search(r'Magnet:\s*(.*)', metadata_text)
        cloud_match = re.search(r'Cloud:\s*(.*)', metadata_text)
        changelog_match = re.search(r'Changelog:\s*(.*)', metadata_text)
        # Campos existentes
        releasing_match = re.search(r'Releasing:\s*(.*)', metadata_text)
        batch_match = re.search(r'Batch:\s*(.*)', metadata_text)
        # Novos campos
        rev_match = re.search(r'Rev:\s*(.*)', metadata_text)
        planning_match = re.search(r'Planning:\s*(.*)', metadata_text)
        
        # Atualizar informações do anime
        if anime_match:
            anime_info['name'] = anime_match.group(1).strip()
        if AnilistID_match:
            anime_info['AniListID'] = AnilistID_match.group(1).strip()
        if date_match:
            anime_info['date'] = date_match.group(1).strip()
        if torrent_match:
            torrent_value = torrent_match.group(1).strip()
            anime_info['torrent'] = torrent_value if torrent_value.lower() != 'false' else ""
        if magnet_match:
            magnet_value = magnet_match.group(1).strip()
            anime_info['magnet'] = magnet_value if magnet_value.lower() != 'false' else ""
        if cloud_match:
            cloud_value = cloud_match.group(1).strip()
            anime_info['cloud'] = cloud_value if cloud_value.lower() != 'false' else ""
        if changelog_match:
            anime_info['has_changelog'] = changelog_match.group(1).strip().lower() == 'true'
        # Processar campos existentes
        if releasing_match:
            anime_info['releasing'] = releasing_match.group(1).strip().lower() == 'true'
        if batch_match:
            anime_info['batch'] = batch_match.group(1).strip().lower() == 'true'
        # Processar novos campos
        if rev_match:
            anime_info['rev'] = rev_match.group(1).strip().lower() == 'true'
        if planning_match:
            anime_info['planning'] = planning_match.group(1).strip().lower() == 'true'
    
    # Extrair seção de Info com padrão mais flexível
    # Esta nova expressão regular captura tudo entre ===Info e a próxima seção ou final do arquivo
    # e aceita variações como **===** ou === no fim
    # Extrair seção de Info e organizar os dados
    info_pattern = r'===Info\s*(.*?)(?:===|$)'
    info_match = re.search(info_pattern, content, re.DOTALL)
    if info_match:
        info_text = info_match.group(1).strip()
        grouped_info = {'Video': [], 'Audio': [], 'Subs': []}
        current_section = None

        for line in info_text.split('\n'):
            line = line.strip()
            if not line:
                continue

            if line.startswith('Video:'):
                current_section = 'Video'
            elif line.startswith('Audio:'):
                current_section = 'Audio'
            elif line.startswith('Subs:'):
                current_section = 'Subs'
            else:
                if current_section and current_section in grouped_info:
                    grouped_info[current_section].append(line)

        # Converter Video de lista para string única
        grouped_info['Video'] = " ".join(grouped_info['Video'])

        anime_info['info'] = grouped_info  # Agora armazenamos um dicionário correto


    
    # Extrair seção de Changelog com padrão similar
    changelog_pattern = r'===Changelog\s*(.*?)(?:\*\*===\*\*|\*===\*|===(?!Info|Changelog|Arquivos)|$)'
    changelog_match = re.search(changelog_pattern, content, re.DOTALL)
    if changelog_match and anime_info['has_changelog']:
        changelog_content = changelog_match.group(1).strip()
        anime_info['changelog'] = changelog_content
        
        # Extrair a data mais recente do changelog
        date_pattern = re.compile(r'- (\d{4}-\d{2}-\d{2}):', re.MULTILINE)
        dates = date_pattern.findall(changelog_content)
        if dates:
            anime_info['last_update'] = dates[0]  # A primeira data geralmente é a mais recente
    
    # Extrair seção de Arquivos com padrão similar
    files_pattern = r'===Arquivos\s*(.*?)(?:\*\*===\*\*|\*===\*|===(?!Info|Changelog|Arquivos)|$)'
    files_match = re.search(files_pattern, content, re.DOTALL)
    if files_match:
        files_content = files_match.group(1).strip()
        anime_info['files'] = files_content
        
        # Processar arquivos com seus links
        lines = files_content.split('\n')
        current_file = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Se a linha não começa com nenhum dos prefixos de link, é um nome de arquivo
            if not line.startswith('Torrent:') and not line.startswith('Magnet:') and not line.startswith('Cloud:'):
                # Este é um nome de arquivo
                current_file = {'filename': line, 'torrent': '', 'magnet': '', 'cloud': ''}
                anime_info['files_with_links'].append(current_file)
            elif current_file is not None:
                # Este é um link para o arquivo atual
                if line.startswith('Torrent:'):
                    current_file['torrent'] = line[8:].strip()
                elif line.startswith('Magnet:'):
                    current_file['magnet'] = line[7:].strip()
                elif line.startswith('Cloud:'):
                    current_file['cloud'] = line[6:].strip()
    
    # Buscar informações do anime no Anilist
    if anime_info['AniListID']:
        anime_info['image_url'], anime_info['banner_url'] = get_anime_images(anime_info['AniListID'])
    
    return anime_info

def get_anime_images(anilist_id):
    query = '''
    query ($id: Int) {
        Media(id: $id, type: ANIME) {
            coverImage {
                extraLarge
            }
            bannerImage
        }
    }
    '''
    
    variables = {'id': int(anilist_id)}
    
    try:
        response = requests.post(
            'https://graphql.anilist.co',
            json={'query': query, 'variables': variables}
        )
        
        if response.status_code == 200:
            data = response.json()
            media_data = data.get('data', {}).get('Media', {})
            cover_image = media_data.get('coverImage', {}).get('extraLarge')
            banner_image = media_data.get('bannerImage')
            
            return cover_image, banner_image
    except Exception as e:
        print(f"Erro ao buscar imagens do AniList: {e}")
    
    return None, None

@app.route('/')
def index():
    anime_projects = []
    markdown_dir = os.path.join(os.path.dirname(__file__), 'Animes')
    
    if os.path.exists(markdown_dir):
        for filename in os.listdir(markdown_dir):
            if filename.endswith('.md'):
                file_path = os.path.join(markdown_dir, filename)
                anime_info = parse_markdown_file(file_path)
                if anime_info:
                    # Converter data para formato amigável
                    try:
                        date_obj = datetime.strptime(anime_info['date'], '%Y-%m-%d')
                        anime_info['formatted_date'] = date_obj.strftime('%d/%m/%Y')
                    except:
                        anime_info['formatted_date'] = anime_info['date']
                    
                    # Formatar data de atualização
                    if anime_info['last_update']:
                        try:
                            update_date_obj = datetime.strptime(anime_info['last_update'], '%Y-%m-%d')
                            anime_info['formatted_update_date'] = update_date_obj.strftime('%d/%m/%Y')
                        except:
                            anime_info['formatted_update_date'] = anime_info['last_update']
                    
                    anime_projects.append(anime_info)
    
    # Ordenar projetos: primeiro os que estão em lançamento (Releasing: True), 
    # depois os demais por ordem alfabética de nome
    anime_projects.sort(key=lambda x: (not x.get('releasing', False), x.get('name', '').lower()))
    
    # Passar o ano atual para o template
    current_year = datetime.now().year
    
    return render_template('index.html', anime_projects=anime_projects, current_year=current_year)

if __name__ == '__main__':
    app.run("0.0.0.0", debug=True)