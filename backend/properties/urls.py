# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Property endpoints
    path('', views.PropertyListAPI.as_view(), name='property-list'),  # List properties
    path('create/', views.PropertyCreateAPI.as_view(), name='property-create'),  # Create property
    path('properties/<int:id>/', views.PropertyDetailAPI.as_view(), name='property-detail'),
    
    # Subscription endpoints
    path('subscriptions/', views.ServiceSubscriptionCreateAPI.as_view(), name='subscription-create'),
    path('users/subscriptions/', views.UserSubscriptionsAPI.as_view(), name='user-subscriptions'),
    
    # Transaction endpoints
    path('transactions/', views.TransactionCreateAPI.as_view(), name='transaction-create'),
    path('users/transactions/', views.UserTransactionsAPI.as_view(), name='user-transactions'),
    
    # Rental Contract endpoints
    path('rental-contracts/', views.RentalContractCreateAPI.as_view(), name='rental-contract-create'),
    path('users/rental-contracts/', views.UserRentalContractsAPI.as_view(), name='user-rental-contracts'),
    
    # Sale Contract endpoints
    path('sale-contracts/', views.SaleContractCreateAPI.as_view(), name='sale-contract-create'),
    path('users/sale-contracts/', views.UserSaleContractsAPI.as_view(), name='user-sale-contracts'),
]
