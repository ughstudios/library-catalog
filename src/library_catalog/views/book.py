from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser

from library_catalog.models.book import Book
from library_catalog.serializers.book import BookSerializer


# pylint: disable=too-few-public-methods
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = [MultiPartParser, FormParser]
