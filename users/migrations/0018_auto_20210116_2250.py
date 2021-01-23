# Generated by Django 3.0.6 on 2021-01-16 22:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_auto_20210116_2238'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealsprofile',
            name='calories',
            field=models.IntegerField(default=2000, validators=[django.core.validators.MinValueValidator(800), django.core.validators.MaxValueValidator(10000)]),
        ),
    ]
