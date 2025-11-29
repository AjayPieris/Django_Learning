import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Project  # <--- Import your Blueprint (Model)

def say_hello(request):
    # 1. Ask the Database for ALL projects
    # This is like saying: "SELECT * FROM api_project"
    all_projects = Project.objects.all()

    # 2. Convert the Python Objects into a List of Dictionaries
    # 'values()' grabs the data fields. 'list()' makes it a Python list.
    data = list(all_projects.values())

    # 3. Send the list as JSON
    # safe=False allows us to send a List (Array) instead of a Dictionary object
    return JsonResponse(data, safe=False)

@csrf_exempt  # <--- This tells Django: "Don't check for a security card on this specific view"
def add_project(request):
    if request.method == 'POST':
        # 1. Decode the JSON data sent by React
        data = json.loads(request.body)
        
        # 2. Create the new Project in the database
        new_project = Project.objects.create(
            name=data['name'],
            language=data['language'],
            description=data['description']
        )
        
        # 3. Send back a success message
        return JsonResponse({"message": "Project added successfully!", "id": new_project.id})
    
    return JsonResponse({"error": "Only POST requests are allowed"}, status=400)