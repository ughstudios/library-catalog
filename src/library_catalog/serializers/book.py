from rest_framework import serializers
from library_catalog.models.book import Book


class BookSerializer(serializers.ModelSerializer):
    # pylint: disable=too-few-public-methods
    class Meta:
        model = Book
        fields = '__all__'
