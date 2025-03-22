import os
import shutil
from flask_frozen import Freezer
from app import app

# Configure the app for static generation
app.config['FREEZER_DESTINATION'] = 'build'  # Output directory
app.config['FREEZER_RELATIVE_URLS'] = True  # Use relative URLs

# Create the freezer
freezer = Freezer(app)

if __name__ == '__main__':
    # Make sure the build directory exists and is empty
    if os.path.exists('build'):
        shutil.rmtree('build')
    os.makedirs('build')
    
    # Copy static files
    print("Copying static files...")
    shutil.copytree('static', os.path.join('build', 'static'))
    
    # Generate the static site
    print("Freezing the site...")
    freezer.freeze()
    
    print("Static site generated in 'build' directory!")