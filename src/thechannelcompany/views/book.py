from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser

from thechannelcompany.models.book import Book
from thechannelcompany.serializers.book import BookSerializer


# pylint: disable=too-few-public-methods
class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = [MultiPartParser, FormParser]
