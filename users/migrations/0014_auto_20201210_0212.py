# Generated by Django 3.0.6 on 2020-12-10 02:12

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_auto_20201210_0207'),
    ]

    operations = [
        migrations.AddField(
            model_name='mealsprofile',
            name='num_of_meals',
            field=models.IntegerField(default=3, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(8)]),
        ),
        migrations.AddField(
            model_name='mealsprofile',
            name='num_of_snacks',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)]),
        ),
    ]
