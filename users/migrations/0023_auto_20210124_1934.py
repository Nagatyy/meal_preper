# Generated by Django 3.0.6 on 2021-01-24 19:34

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0022_auto_20210123_2213'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='preferred_height_units',
            field=models.CharField(choices=[('cm', 'cm')], default='cm', max_length=2),
        ),
        migrations.AlterField(
            model_name='mealsprofile',
            name='calories',
            field=models.IntegerField(default=2000, validators=[django.core.validators.MinValueValidator(600), django.core.validators.MaxValueValidator(10000)]),
        ),
        migrations.AlterField(
            model_name='profile',
            name='age',
            field=models.IntegerField(default=-1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
        ),
    ]
