# Generated by Django 2.0.8 on 2019-02-13 14:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('strt_users', '0003_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='token',
            name='expires',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]