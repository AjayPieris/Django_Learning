from django.db import models

# This Class = One Database Table
class Project(models.Model):
    name = models.CharField(max_length=200)
    language = models.CharField(max_length=100)
    description = models.TextField()
    
    # OLD: image = models.ImageField(...)
    # NEW: FileField accepts .mp4, .pdf, .jpg, anything!
    image = models.FileField(upload_to='project_files/', null=True, blank=True) 

    def __str__(self):
        return self.name