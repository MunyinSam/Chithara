from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_style_used_to_generation_history'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='cover_image',
            field=models.FileField(blank=True, null=True, upload_to='covers/'),
        ),
    ]
