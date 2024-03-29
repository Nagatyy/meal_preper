# Generated by Django 3.0.6 on 2020-06-26 21:17

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0006_auto_20200614_2041'),
    ]

    operations = [
        migrations.CreateModel(
            name='MealsProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('calories', models.IntegerField(default=2000, validators=[django.core.validators.MinValueValidator(800), django.core.validators.MaxValueValidator(10000)])),
                ('carbs_percent', models.IntegerField(default=40, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('protein_percent', models.IntegerField(default=30, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('fat_percent', models.IntegerField(default=30, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('num_of_meals', models.IntegerField(default=3, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(8)])),
                ('num_of_snacks', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
