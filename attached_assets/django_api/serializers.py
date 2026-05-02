"""
AL-FIRDAOUS STORE — DRF serializers
Fields are named in camelCase to match the mobile app exactly.
"""
from rest_framework import serializers
from .models import Product, Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "author", "rating", "comment", "date"]


class ProductSerializer(serializers.ModelSerializer):
    # Rename snake_case Django fields to camelCase for the mobile app
    productType = serializers.CharField(source="product_type")
    reviewCount = serializers.IntegerField(source="review_count")
    isNew = serializers.BooleanField(source="is_new")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "productType",
            "ref",
            "price",
            "promo",
            "brand",
            "image",
            "images",
            "sizes",
            "description",
            "rating",
            "reviewCount",
            "isNew",
        ]


class ProductDetailSerializer(ProductSerializer):
    """Full product detail including reviews."""
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ["reviews"]
