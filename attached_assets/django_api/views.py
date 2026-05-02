"""
AL-FIRDAOUS STORE — DRF views
Requires: pip install djangorestframework django-cors-headers
"""
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Review
from .serializers import ProductSerializer, ProductDetailSerializer, ReviewSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    list:   GET /api/products/
    detail: GET /api/products/{id}/

    Query params for list:
      category  — Shoe | Sandal | Shirt | Pant
      search    — searches name and brand
      sort      — price_asc | price_desc | rating
      promo     — true  (only discounted items)
      is_new    — true  (only new arrivals)
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        category = params.get("category")
        search = params.get("search", "").strip()
        sort = params.get("sort", "default")
        promo = params.get("promo")
        is_new = params.get("is_new")

        if category:
            qs = qs.filter(product_type=category)

        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(brand__icontains=search)
                | Q(category__icontains=search)
                | Q(ref__icontains=search)
            )

        if promo == "true":
            qs = qs.filter(promo__gt=0)

        if is_new == "true":
            qs = qs.filter(is_new=True)

        if sort == "price_asc":
            qs = qs.order_by("price")
        elif sort == "price_desc":
            qs = qs.order_by("-price")
        elif sort == "rating":
            qs = qs.order_by("-rating")

        return qs

    @action(detail=False, url_path="new-arrivals")
    def new_arrivals(self, request):
        """GET /api/products/new-arrivals/"""
        qs = self.get_queryset().filter(is_new=True)[:10]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, url_path="on-sale")
    def on_sale(self, request):
        """GET /api/products/on-sale/"""
        qs = self.get_queryset().filter(promo__gt=0)[:10]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, url_path="related")
    def related(self, request, pk=None):
        """GET /api/products/{id}/related/"""
        product = self.get_object()
        qs = (
            Product.objects.filter(product_type=product.product_type)
            .exclude(pk=product.pk)[:4]
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/reviews/?product_id={id}"""
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.request.query_params.get("product_id")
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.none()
