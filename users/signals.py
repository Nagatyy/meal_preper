from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile, MealsProfile, Meals
from django.core.exceptions import ObjectDoesNotExist


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def create_meals_profile(sender, instance, created, **kwargs):
	if created:
		MealsProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_meals_profile(sender, instance, **kwargs):
	instance.mealsprofile.save()


##########################################################

@receiver(post_save, sender=User)
def create_meals(sender, instance, created, **kwargs):
	if created:
		Meals.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_meals(sender, instance, **kwargs):
	try:
		instance.meals.save()
	except ObjectDoesNotExist:
		Meals.objects.create(user=instance)









# we have a sender, and a signal of post_save
# when a user is saved, send the post_save signal which will be received by the receiver
# this reciever is the create_profile function that out post_save signal passed to it
# if that user is created, create a profile for them