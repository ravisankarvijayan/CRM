# Generated by Django 5.0.2 on 2024-02-21 00:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillingDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=15, validators=[django.core.validators.RegexValidator('^\\d{10}$', message='Enter a valid phone number.')])),
                ('email', models.EmailField(max_length=254)),
                ('billing_date', models.DateField(auto_now_add=True)),
                ('invoice_date', models.DateField(auto_now_add=True)),
                ('invoice_number', models.CharField(max_length=100)),
                ('product_name', models.CharField(max_length=100)),
                ('price', models.FloatField()),
                ('quantity', models.IntegerField(default=1)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('coupon_code', models.CharField(blank=True, max_length=20, null=True)),
                ('payment_status', models.CharField(choices=[('paid', 'Paid'), ('unpaid', 'Unpaid'), ('partially_paid', 'Partially Paid')], default='unpaid', max_length=20)),
                ('payment_method', models.CharField(blank=True, choices=[('credit_card', 'Credit Card'), ('bank_transfer', 'Bank Transfer'), ('cash', 'Cash')], max_length=20, null=True)),
            ],
        ),
    ]