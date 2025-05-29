# backend/properties/management/commands/populate_properties.py

import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.base import ContentFile # For dummy files if needed
import datetime

# Import models from 'properties' app
from properties.models import (
    Property, PropertyType, PropertyStatus, Amenity,
    Location, PropertyImage, PropertyVideo, PlaceOfInterest, PropertyPlaceOfInterest
)
# Import models from 'core' app
from core.models import Agency # Assuming User model is fetched by get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with example property data.'

    def _create_prerequisites(self):
        self.stdout.write(self.style.HTTP_INFO('Creating prerequisite data...'))

        # Property Types
        property_types_data = [
            {'name': 'House', 'description': 'Detached or semi-detached residential house.'},
            {'name': 'Apartment', 'description': 'Self-contained housing unit in a building.'},
            {'name': 'Condominium', 'description': 'Individually owned unit in a multi-unit building.'},
            {'name': 'Townhouse', 'description': 'Terraced house, often with multiple floors.'},
            {'name': 'Land', 'description': 'Undeveloped or agricultural land.'},
            {'name': 'Commercial Building', 'description': 'Building for business purposes.'},
            {'name': 'Office Space', 'description': 'Space suitable for office operations.'},
            {'name': 'Retail Shop', 'description': 'Space for retail business.'},
        ]
        for pt_data in property_types_data:
            PropertyType.objects.get_or_create(name=pt_data['name'], defaults=pt_data)
        self.stdout.write(self.style.SUCCESS('Property types ensured.'))

        # Property Statuses
        property_statuses_data = [
            {'name': 'Available', 'description': 'Currently available for sale/rent/lease.'},
            {'name': 'Pending', 'description': 'Offer accepted, sale/rent/lease pending.'},
            {'name': 'Sold', 'description': 'Property has been sold.'},
            {'name': 'Rented', 'description': 'Property has been rented.'},
            {'name': 'Leased', 'description': 'Property has been leased.'},
            {'name': 'Under Offer', 'description': 'An offer has been made and is being considered.'},
            {'name': 'Off Market', 'description': 'Not currently available.'},
        ]
        for ps_data in property_statuses_data:
            PropertyStatus.objects.get_or_create(name=ps_data['name'], defaults=ps_data)
        self.stdout.write(self.style.SUCCESS('Property statuses ensured.'))

        # Amenities
        amenities_data = [
            {'name': 'Swimming Pool', 'description': 'Private or communal swimming pool.'},
            {'name': 'Garage', 'description': 'Covered parking space for vehicles.'},
            {'name': 'Garden', 'description': 'Private or communal garden area.'},
            {'name': 'Air Conditioning', 'description': 'Central or unit air conditioning.'},
            {'name': 'Gymnasium', 'description': 'Access to a fitness center.'},
            {'name': 'Security System', 'description': 'Installed security alarm or cameras.'},
            {'name': 'Borehole', 'description': 'On-site water borehole.'},
            {'name': 'Solar Power', 'description': 'Solar panels for electricity.'},
            {'name': 'Fiber Internet', 'description': 'High-speed fiber optic internet connectivity.'},
        ]
        for amenity_data in amenities_data:
            Amenity.objects.get_or_create(name=amenity_data['name'], defaults=amenity_data)
        self.stdout.write(self.style.SUCCESS('Amenities ensured.'))

        # Places of Interest
        places_of_interest_data = [
            {'name': 'Main Shopping Mall', 'type': 'Shopping', 'latitude': -17.8259, 'longitude': 31.0496}, # Example coords
            {'name': 'City Center Park', 'type': 'Recreation', 'latitude': -17.8293, 'longitude': 31.0539},
            {'name': 'General Hospital', 'type': 'Healthcare', 'latitude': -17.8195, 'longitude': 31.0305},
            {'name': 'Elite Primary School', 'type': 'Education', 'latitude': -17.8000, 'longitude': 31.0500},
            {'name': 'Downtown Business Hub', 'type': 'Business', 'latitude': -17.8277, 'longitude': 31.0531},
        ]
        for poi_data in places_of_interest_data:
            PlaceOfInterest.objects.get_or_create(name=poi_data['name'], defaults=poi_data)
        self.stdout.write(self.style.SUCCESS('Places of Interest ensured.'))

        # Agent and Agency
        self.agent_user, created = User.objects.get_or_create(
            email='agent.smith@example.com',
            defaults={
                'first_name': 'Agent',
                'last_name': 'Smith',
                'role': 'agent', # Make sure 'agent' is a valid choice in your User model's 'role' field
                'is_staff': True, # Agents might need some staff privileges depending on your setup
                'is_active': True,
                'email_verified': True,
                'phone_number': '+263772123456' # Example phone number
            }
        )
        if created:
            self.agent_user.set_password('strongPassw0rd!')
            self.agent_user.save()
            self.stdout.write(self.style.SUCCESS(f'Agent user "{self.agent_user.email}" created.'))
        else:
            self.stdout.write(self.style.WARNING(f'Agent user "{self.agent_user.email}" already exists.'))

        self.agency, created = Agency.objects.get_or_create(
            name='Prime Properties Zimbabwe',
            defaults={
                'description': 'Leading real estate agency in Zimbabwe.',
                'website': 'https://primeprop.co.zw',
                'verified': True,
                'address': '123 Samora Machel Ave, Harare',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Agency "{self.agency.name}" created.'))
        else:
            self.stdout.write(self.style.WARNING(f'Agency "{self.agency.name}" already exists.'))
        
        # Assign agent to agency if not already
        if not self.agent_user.agency:
            self.agent_user.agency = self.agency
            self.agent_user.save(update_fields=['agency'])
            self.stdout.write(self.style.SUCCESS(f'Assigned agent "{self.agent_user.email}" to agency "{self.agency.name}".'))


    def _create_properties(self):
        self.stdout.write(self.style.HTTP_INFO('Creating example property listings...'))

        property_data_list = [
            {
                'title': 'Luxurious 4-Bed House in Borrowdale Brooke',
                'description': 'Stunning family home with modern finishes, a beautiful garden, and swimming pool. Located in the prestigious Borrowdale Brooke golf estate.',
                'property_type_name': 'House',
                'status_name': 'Available',
                'listing_type': Property.ListingTypeChoices.SALE,
                'price': Decimal('450000.00'),
                'currency': 'USD',
                'address_line_1': '15 Golf Course Drive',
                'city': 'Harare',
                'state_province': 'Harare',
                'postal_code': '00000',
                'country': 'Zimbabwe',
                'latitude': -17.7389, 
                'longitude': 31.1334,
                'bedrooms': 4,
                'bathrooms': Decimal('3.5'),
                'square_footage': 350,
                'lot_size': Decimal('0.2'), # Assuming acres or similar unit
                'year_built': 2015,
                'amenity_names': ['Swimming Pool', 'Garage', 'Garden', 'Air Conditioning', 'Security System', 'Borehole', 'Solar Power'],
                'tags': ['luxury', 'family home', 'golf estate', 'borrowdale'],
                'additional_features': {'kitchen': 'Modern, fully-fitted with granite tops', 'lounge': 'Spacious with fireplace'},
                'poi_names': ['Elite Primary School', 'Main Shopping Mall'],
                'is_published': True,
                'featured': True,
            },
            {
                'title': 'Modern 2-Bed Apartment in Avondale',
                'description': 'Chic and secure apartment perfect for young professionals or small families. Close to amenities and city center.',
                'property_type_name': 'Apartment',
                'status_name': 'Available',
                'listing_type': Property.ListingTypeChoices.RENT,
                'price': Decimal('850.00'),
                'rental_frequency': Property.RentalFrequencyChoices.MONTHLY,
                'currency': 'USD',
                'address_line_1': '45 King George Road',
                'city': 'Harare',
                'state_province': 'Harare',
                'postal_code': '00000',
                'country': 'Zimbabwe',
                'latitude': -17.8005, 
                'longitude': 31.0300,
                'bedrooms': 2,
                'bathrooms': Decimal('2.0'),
                'square_footage': 120,
                'amenity_names': ['Garage', 'Security System', 'Fiber Internet'],
                'tags': ['modern', 'avondale', 'apartment', 'secure'],
                'poi_names': ['City Center Park'],
                'is_published': True,
            },
            {
                'title': 'Prime Commercial Space in CBD',
                'description': 'Excellent office or retail space with high foot traffic in the heart of Harare CBD.',
                'property_type_name': 'Office Space',
                'status_name': 'Available',
                'listing_type': Property.ListingTypeChoices.LEASE,
                'price': Decimal('15.00'), # Price per sqm or unit
                'rental_frequency': Property.RentalFrequencyChoices.MONTHLY,
                'currency': 'USD',
                'address_line_1': '78 First Street',
                'city': 'Harare',
                'state_province': 'Harare',
                'postal_code': '00000',
                'country': 'Zimbabwe',
                'latitude': -17.8292, 
                'longitude': 31.0522,
                'square_footage': 200,
                'amenity_names': ['Air Conditioning', 'Fiber Internet'],
                'tags': ['commercial', 'cbd', 'office', 'retail'],
                'poi_names': ['Downtown Business Hub'],
                'is_published': True,
            },
            {
                'title': 'Spacious Residential Land in Domboshava',
                'description': 'Large plot of land ideal for building your dream home in a serene environment, just outside Harare.',
                'property_type_name': 'Land',
                'status_name': 'Available',
                'listing_type': Property.ListingTypeChoices.SALE,
                'price': Decimal('35000.00'),
                'currency': 'USD',
                'address_line_1': 'Plot 5, Domboshava Hills',
                'city': 'Domboshava',
                'state_province': 'Mashonaland East',
                'postal_code': '00000',
                'country': 'Zimbabwe',
                'latitude': -17.6092, 
                'longitude': 31.1436,
                'lot_size': Decimal('2.0'), # Assuming acres
                'tags': ['land for sale', 'domboshava', 'residential plot'],
                'is_published': True,
            }
        ]

        for prop_data in property_data_list:
            # Get related objects
            prop_type = PropertyType.objects.get(name=prop_data.pop('property_type_name'))
            prop_status = PropertyStatus.objects.get(name=prop_data.pop('status_name'))
            
            location, _ = Location.objects.get_or_create(
                latitude=prop_data.pop('latitude'),
                longitude=prop_data.pop('longitude'),
                defaults={
                    'address': prop_data.get('address_line_1', '') + ', ' + prop_data.get('city', ''),
                    'city': prop_data.get('city', ''),
                    'country': prop_data.get('country', '')
                }
            )

            amenities = Amenity.objects.filter(name__in=prop_data.pop('amenity_names', []))
            pois = PlaceOfInterest.objects.filter(name__in=prop_data.pop('poi_names', []))

            # Create Property instance
            property_instance, created = Property.objects.get_or_create(
                title=prop_data['title'],
                agent=self.agent_user,
                defaults={
                    **prop_data,
                    'agency': self.agency,
                    'property_type': prop_type,
                    'status': prop_status,
                    'location': location,
                    'published_at': timezone.now() if prop_data.get('is_published') else None,
                    'featured_until': timezone.now() + datetime.timedelta(days=30) if prop_data.get('featured') else None,
                }
            )

            if created:
                # Add M2M relations
                if amenities.exists():
                    property_instance.amenities.set(amenities)
                
                # Add POIs through the intermediary model
                for poi in pois:
                    PropertyPlaceOfInterest.objects.create(
                        property=property_instance,
                        place_of_interest=poi,
                        distance_km=Decimal(random.uniform(0.5, 5.0)), # Random distance
                        notes=f"{poi.name} is nearby."
                    )

                # Create dummy images and videos (mocking actual file uploads)
                for i in range(1, random.randint(2,5)): # 1 to 4 images
                    PropertyImage.objects.create(
                        property=property_instance,
                        # image=ContentFile(b"dummy image content", name=f"prop_{property_instance.id}_img_{i}.jpg"), # Requires actual file handling
                        image_url=f"https://placehold.co/800x600/EBF4FF/7F9CF5?text=Property+{property_instance.id}+Image+{i}", # Using placeholder URL
                        caption=f"Sample image {i} for {property_instance.title}",
                        is_primary=(i==1)
                    )
                
                if property_instance.property_type.name not in ['Land']: # No videos for land typically
                    PropertyVideo.objects.create(
                        property=property_instance,
                        # video=ContentFile(b"dummy video content", name=f"prop_{property_instance.id}_vid_1.mp4"), # Requires actual file handling
                        video_url=f"https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", # Sample video URL
                        caption=f"Walkthrough of {property_instance.title}",
                        thumbnail_url=f"https://placehold.co/400x300/E0FDEF/7F9CF5?text=Video+Thumb"
                    )

                self.stdout.write(self.style.SUCCESS(f'Successfully created property: "{property_instance.title}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Property "{prop_data["title"]}" already exists.'))


    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting property data population...'))
        self._create_prerequisites()
        self._create_properties()
        self.stdout.write(self.style.SUCCESS('Property data population complete!'))

