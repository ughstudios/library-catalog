from rest_framework import serializers
from thechannelcompany.models.book import Book


class BookSerializer(serializers.ModelSerializer):
    # pylint: disable=too-few-public-methods
    class Meta:
        model = Book
        fields = '__all__'
