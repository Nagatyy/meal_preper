# Generated by Django 3.0.6 on 2021-01-17 20:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_auto_20210116_2341'),
    ]

    operations = [
        migrations.AddField(
            model_name='meals',
            name='user_saved_meals',
            field=models.TextField(default='{}'),
        ),
    ]
