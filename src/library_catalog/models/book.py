import os

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from PIL import Image


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    publication_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    pages = models.IntegerField()
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    language = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.cover:
            img = Image.open(self.cover.path)
            max_size = (300, 300)
            img.thumbnail(max_size)
            img.save(self.cover.path)


def delete_file(path: str) -> None:
    if os.path.isfile(path):
        os.remove(path)


@receiver(post_delete, sender=Book)
def delete_cover_on_delete(sender, instance, **kwargs) -> None:  # pylint: disable=unused-argument
    if instance.cover:
        delete_file(str(instance.cover.path))


@receiver(pre_save, sender=Book)
def delete_old_cover_on_update(sender, instance, **kwargs) -> None:  # pylint: disable=unused-argument
    if not instance.pk:
        return

    old_instance = Book.objects.get(pk=instance.pk)

    if old_instance.cover and old_instance.cover != instance.cover:
        delete_file(str(old_instance.cover.path))
