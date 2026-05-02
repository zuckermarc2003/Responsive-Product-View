"""
AL-FIRDAOUS STORE — Django models
Drop this into your Django app (e.g. store/models.py)
Run: python manage.py makemigrations && python manage.py migrate
"""
from django.db import models


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ("Shoe", "Chaussure"),
        ("Sandal", "Sandale"),
        ("Shirt", "Chemise"),
        ("Pant", "Pantalon"),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, db_index=True)
    ref = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    promo = models.IntegerField(default=0, help_text="Discount percentage, e.g. 20 = 20% off")
    brand = models.CharField(max_length=100)
    # Use URLField if images are stored on an external CDN (Cloudinary, S3, etc.)
    image = models.URLField(max_length=500, help_text="Primary product image URL")
    images = models.JSONField(default=list, help_text="List of additional image URLs")
    sizes = models.JSONField(default=list, help_text="Available sizes, e.g. ['39','40','41']")
    description = models.TextField(blank=True)
    rating = models.FloatField(default=0.0)
    review_count = models.IntegerField(default=0)
    is_new = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.brand} — {self.name} ({self.ref})"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    author = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField()
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.author} — {self.product.name} ({self.rating}/5)"
