# Generated by Django 3.0.6 on 2020-06-27 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_mealsprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='is_new_user',
            field=models.BooleanField(default=True),
        ),
    ]
