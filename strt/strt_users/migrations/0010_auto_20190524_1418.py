# Generated by Django 2.0.8 on 2019-05-24 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strt_users', '0009_membershiptype_attore'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membershiptype',
            name='attore',
        ),
        migrations.AddField(
            model_name='usermembership',
            name='attore',
            field=models.CharField(choices=[('unknown', 'UNKNOWN'), ('comune', 'Comune'), ('regione', 'Regione'), ('ac', 'AC'), ('sca', 'SCA'), ('enti', 'ENTI'), ('genio_civile', 'GENIO_CIVILE')], default='unknown', max_length=80),
        ),
    ]