# Generated by Django 3.0.6 on 2021-01-16 22:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_auto_20210116_2104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealsprofile',
            name='num_of_meals',
            field=models.IntegerField(default=3, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(6)]),
        ),
        migrations.AlterField(
            model_name='mealsprofile',
            name='num_of_snacks',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(6)]),
        ),
    ]
