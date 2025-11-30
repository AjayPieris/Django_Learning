import json
from django.contrib.auth import authenticate # <--- The Tool to check passwords
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
        # 1. Get text data from the 'Form' (not JSON body)
        name = request.POST.get('name')
        language = request.POST.get('language')
        description = request.POST.get('description')
        
        # 2. Get the Image from 'FILES'
        image = request.FILES.get('image')  # This might be None if they didn't upload one

        # 3. Save to Database
        new_project = Project.objects.create(
            name=name,
            language=language,
            description=description,
            image=image  # Django handles saving the file to the 'media' folder automatically!
        )
        
        return JsonResponse({
            "message": "Project added successfully!", 
            "id": new_project.id,
            "image_url": new_project.image.url if new_project.image else None
        })
    
    return JsonResponse({"error": "POST request required"}, status=400)

# ... keep your existing imports and functions ...

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # 1. Get the username/password from React
        username = data.get('username')
        password = data.get('password')
        
        # 2. Ask Django: "Does this user exist?"
        # authenticate() returns the User object if correct, or None if wrong.
        user = authenticate(username=username, password=password)
        
        if user is not None:
            return JsonResponse({"message": "Login Successful!", "username": user.username})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)
    
    return JsonResponse({"error": "POST request required"}, status=400)

@csrf_exempt
def delete_project(request, project_id):
    if request.method == 'DELETE':
        try:
            # 1. Find the project with this specific ID
            project = Project.objects.get(id=project_id)
            
            # 2. Delete it from the database
            project.delete()
            
            return JsonResponse({"message": "Project deleted successfully!"})
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)
            
    return JsonResponse({"error": "DELETE request required"}, status=400)

# api/views.py

@csrf_exempt
def update_project(request, project_id):
    if request.method == 'POST':
        try:
            # 1. Find the project
            project = Project.objects.get(id=project_id)
            
            # 2. Update the Text Fields
            project.name = request.POST.get('name')
            project.language = request.POST.get('language')
            project.description = request.POST.get('description')
            
            # 3. Handle the Image (Only update if a new one was sent)
            image = request.FILES.get('image')
            if image:
                project.image = image
            
            # 4. Save Changes
            project.save()
            
            return JsonResponse({"message": "Project updated successfully!"})
        
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

    return JsonResponse({"error": "POST request required"}, status=400)