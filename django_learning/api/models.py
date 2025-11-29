from django.db import models

# This Class = One Database Table
class Project(models.Model):
    name = models.CharField(max_length=200)  # Like "CeylonConnect"
    language = models.CharField(max_length=100) # Like "Python" or "React"
    description = models.TextField() # A long text for details

    # This fixes a small display issue we will see later
    def __str__(self):
        return self.name