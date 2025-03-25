import os
import json
from datetime import datetime

class ImageCache:
    def __init__(self, cache_file='static/cache/AniListCache.json'):
        self.cache_file = cache_file
        self.cache_dir = os.path.dirname(cache_file)
        self.cache_data = {}
        self.cache_age = {}
        self.cache_expiry_days = 30  # Cache entries expire after 30 days
        self._load_cache()
    
    def _load_cache(self):
        """Load the cache from the JSON file."""
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    cache_content = json.load(f)
                    self.cache_data = cache_content.get('data', {})
                    self.cache_age = cache_content.get('age', {})
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading cache: {e}")
                self.cache_data = {}
                self.cache_age = {}
    
    def _save_cache(self):
        """Save the cache to the JSON file."""
        try:
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'data': self.cache_data,
                    'age': self.cache_age
                }, f, indent=2)
        except IOError as e:
            print(f"Error saving cache: {e}")
    
    def get(self, anilist_id):
        """Get image URLs for an AniList ID from the cache."""
        anilist_id = str(anilist_id)  # Ensure string keys
        
        # Check if ID exists in cache and is not expired
        if anilist_id in self.cache_data:
            # Check cache age
            cache_date = datetime.strptime(self.cache_age.get(anilist_id, '2000-01-01'), '%Y-%m-%d')
            days_old = (datetime.now() - cache_date).days
            
            if days_old <= self.cache_expiry_days:
                return self.cache_data[anilist_id]
        
        return None
    
    def set(self, anilist_id, cover_image, banner_image):
        """Store image URLs in the cache."""
        anilist_id = str(anilist_id)  # Ensure string keys
        self.cache_data[anilist_id] = {
            'cover_image': cover_image,
            'banner_image': banner_image
        }
        self.cache_age[anilist_id] = datetime.now().strftime('%Y-%m-%d')
        self._save_cache()
        
    def clear_expired(self):
        """Clear expired cache entries."""
        today = datetime.now()
        expired_ids = []
        
        for anilist_id, cache_date_str in self.cache_age.items():
            cache_date = datetime.strptime(cache_date_str, '%Y-%m-%d')
            if (today - cache_date).days > self.cache_expiry_days:
                expired_ids.append(anilist_id)
        
        for anilist_id in expired_ids:
            if anilist_id in self.cache_data:
                del self.cache_data[anilist_id]
            del self.cache_age[anilist_id]
        
        if expired_ids:
            self._save_cache()
            return len(expired_ids)
        return 0