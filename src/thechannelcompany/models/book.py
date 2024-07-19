from django.db.models import Model
from django.db.models.fields import CharField, DateField, IntegerField
from django.db.models.fields.files import ImageField


class Book(Model):
    title = CharField(max_length=200)
    author = CharField(max_length=200)
    publication_date = DateField()
    isbn = CharField(max_length=13, unique=True)
    pages = IntegerField()
    cover = ImageField(upload_to='covers/', blank=True, null=True)
    language = CharField(max_length=50)

    def __str__(self) -> str:
        return str(self.title)
