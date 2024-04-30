# Generated by Django 4.2.5 on 2024-04-02 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0011_feedbackformresponse'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResponseModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_id', models.CharField(max_length=100, unique=True)),
                ('customername', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('mobile', models.CharField(max_length=15)),
                ('shopname', models.CharField(max_length=100)),
                ('productname', models.CharField(max_length=100)),
                ('issue_or_service', models.CharField(max_length=255)),
            ],
        ),
    ]
