# Generated by Django 4.1.4 on 2024-02-26 05:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop_app', '0002_billingdetails'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shop',
            name='user',
        ),
        migrations.AddField(
            model_name='shop',
            name='user',
            field=models.ManyToManyField(default=None, to=settings.AUTH_USER_MODEL),
        ),
    ]