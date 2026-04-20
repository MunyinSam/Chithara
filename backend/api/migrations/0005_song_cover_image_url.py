from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_song_cover_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='cover_image',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
