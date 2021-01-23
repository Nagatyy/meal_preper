# Generated by Django 3.0.6 on 2020-11-15 17:38

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_profile_is_new_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='height',
            field=models.IntegerField(default=-1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(300)]),
        ),
    ]
