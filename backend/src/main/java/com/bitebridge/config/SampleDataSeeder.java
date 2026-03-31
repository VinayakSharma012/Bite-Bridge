package com.bitebridge.config;

import com.mongodb.client.model.ReplaceOptions;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = false)
public class SampleDataSeeder implements CommandLineRunner {

    private static final Logger logger = Logger.getLogger(SampleDataSeeder.class.getName());

    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public SampleDataSeeder(MongoTemplate mongoTemplate, PasswordEncoder passwordEncoder) {
        this.mongoTemplate = mongoTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            long restaurantCount = mongoTemplate.collectionExists("restaurants")
                    ? mongoTemplate.getCollection("restaurants").countDocuments()
                    : 0;
            long menuCount = mongoTemplate.collectionExists("menu_items")
                    ? mongoTemplate.getCollection("menu_items").countDocuments()
                    : 0;

            if (restaurantCount >= 10 && menuCount >= 50) {
                logger.info("Sample data seeding skipped: enough restaurant/menu data already present.");
                return;
            }

            LocalDateTime now = LocalDateTime.now();

            seedUsers(now);
            List<Document> restaurants = seedRestaurants(now);
            seedMenus(restaurants, now);
            seedCoupons(restaurants, now);

            logger.info("Seed complete: 12 restaurants with menu and coupon data are now available.");
            logger.info("Demo login -> customer: rahul@bitebridge.com / Pass@123");
            logger.info("Demo login -> admin: admin@bitebridge.com / Pass@123");
        } catch (Exception ex) {
            logger.warning("Sample data seeding failed, continuing app startup: " + ex.getMessage());
        }
    }

    private void seedUsers(LocalDateTime now) {
        upsert("users", userDoc("u_admin", "Aditi Admin", "admin@bitebridge.com", "9000000001", "ADMIN", now.minusDays(60)));
        upsert("users", userDoc("u_customer_1", "Rahul Sharma", "rahul@bitebridge.com", "9000000002", "CUSTOMER", now.minusDays(20)));
        upsert("users", userDoc("u_delivery_1", "Vikram Rider", "vikram.delivery@bitebridge.com", "9000000003", "DELIVERY_AGENT", now.minusDays(25)));

        upsert("users", userDoc("u_owner_1", "Neha Kapoor", "owner1@bitebridge.com", "9000000011", "RESTAURANT_OWNER", now.minusDays(40)));
        upsert("users", userDoc("u_owner_2", "Arjun Mehta", "owner2@bitebridge.com", "9000000012", "RESTAURANT_OWNER", now.minusDays(38)));
        upsert("users", userDoc("u_owner_3", "Isha Malhotra", "owner3@bitebridge.com", "9000000013", "RESTAURANT_OWNER", now.minusDays(36)));
        upsert("users", userDoc("u_owner_4", "Kabir Anand", "owner4@bitebridge.com", "9000000014", "RESTAURANT_OWNER", now.minusDays(34)));
    }

    private List<Document> seedRestaurants(LocalDateTime now) {
        List<Document> restaurants = new ArrayList<>();

        String[] names = {
                "Bombay Tandoor House", "Coastal Spice Kitchen", "Royal Biryani Co.", "Green Bowl Cafe",
                "Sushi & Soy", "Punjab Grill Story", "The Pasta Atelier", "Kolkata Roll Junction",
                "Hyderabadi Dum Point", "Street Wok Express", "Mediterranean Mezze", "Burger Foundry"
        };

        List<List<String>> cuisines = List.of(
                List.of("North Indian", "Mughlai"),
                List.of("Seafood", "South Indian"),
                List.of("Biryani", "Indian"),
                List.of("Healthy", "Salads"),
                List.of("Japanese", "Asian"),
                List.of("Punjabi", "North Indian"),
                List.of("Italian", "Continental"),
                List.of("Bengali", "Street Food"),
                List.of("Hyderabadi", "Biryani"),
                List.of("Chinese", "Thai"),
                List.of("Mediterranean", "Lebanese"),
                List.of("American", "Fast Food")
        );

        for (int i = 0; i < names.length; i++) {
            String id = "r_" + (i + 1);
            String ownerId = "u_owner_" + ((i % 4) + 1);

            Document restaurant = new Document();
            restaurant.append("_id", id)
                    .append("ownerId", ownerId)
                    .append("name", names[i])
                    .append("description", names[i] + " serving high-quality food with consistent delivery experience")
                    .append("cuisineTypes", cuisines.get(i))
                    .append("address", addressDoc("addr_" + id, "Restaurant", (10 + i) + " Central Avenue", "Mumbai", "Maharashtra", "4000" + (30 + i), 19.05 + (i * 0.004), 72.82 + (i * 0.003), false))
                    .append("coverImageUrl", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80")
                    .append("logoUrl", "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80")
                    .append("rating", 4.1 + ((i % 5) * 0.15))
                    .append("totalReviews", 300 + (i * 120))
                    .append("openingHours", openingHoursDoc())
                    .append("deliveryRadius", 6.0 + (i % 4))
                    .append("minOrderAmount", 149.0 + ((i % 3) * 50))
                    .append("deliveryFee", 20.0 + ((i % 4) * 10))
                    .append("avgDeliveryTime", 22 + ((i % 5) * 5))
                    .append("active", true)
                    .append("approved", true)
                    .append("tags", List.of("Top Rated", "Fast Delivery"))
                    .append("createdAt", now.minusDays(45 - i))
                    .append("updatedAt", now.minusDays(i % 3));

            upsert("restaurants", restaurant);
            restaurants.add(restaurant);
        }

        return restaurants;
    }

    private void seedMenus(List<Document> restaurants, LocalDateTime now) {
        int itemCounter = 1;

        for (Document restaurant : restaurants) {
            String restaurantId = restaurant.getString("_id");

            List<Document> items = List.of(
                    menuDoc("m_" + itemCounter++, restaurantId, "Chef Special Platter", "Main Course", 329, false, now),
                    menuDoc("m_" + itemCounter++, restaurantId, "Signature Starter", "Starters", 229, true, now),
                    menuDoc("m_" + itemCounter++, restaurantId, "House Bowl", "Rice & Bowls", 269, false, now),
                    menuDoc("m_" + itemCounter++, restaurantId, "Loaded Wrap", "Wraps", 199, false, now),
                    menuDoc("m_" + itemCounter++, restaurantId, "Fresh Salad", "Healthy", 179, true, now),
                    menuDoc("m_" + itemCounter++, restaurantId, "Dessert Jar", "Desserts", 149, true, now)
            );

            for (Document item : items) {
                upsert("menu_items", item);
            }
        }
    }

    private void seedCoupons(List<Document> restaurants, LocalDateTime now) {
        upsert("coupons", couponDoc("c_welcome", "WELCOME30", "FLAT", 30, 199, now.minusDays(20), now.plusDays(180), List.of()));
        upsert("coupons", couponDoc("c_save20", "SAVE20", "PERCENTAGE", 20, 299, now.minusDays(15), now.plusDays(120), List.of()));
        upsert("coupons", couponDoc("c_freedel", "FREEDEL", "FLAT", 40, 249, now.minusDays(10), now.plusDays(90), List.of()));

        for (int i = 0; i < Math.min(10, restaurants.size()); i++) {
            String restaurantId = restaurants.get(i).getString("_id");
            String code = "REST" + (i + 1) + "15";
            upsert("coupons", couponDoc("c_rest_" + (i + 1), code, "PERCENTAGE", 15, 199, now.minusDays(5), now.plusDays(60), List.of(restaurantId)));
        }
    }

    private Document userDoc(String id, String name, String email, String phone, String role, LocalDateTime createdAt) {
        Document doc = new Document();
        doc.append("_id", id)
                .append("name", name)
                .append("email", email)
                .append("phone", phone)
                .append("passwordHash", passwordEncoder.encode("Pass@123"))
                .append("role", role)
                .append("addresses", List.of(addressDoc("addr_" + id, "Home", "Palm Residency", "Mumbai", "Maharashtra", "400001", 19.0760, 72.8777, true)))
                .append("foodPreferences", List.of("Indian", "Chinese"))
                .append("dietaryPreferences", List.of("Balanced"))
                .append("profileImageUrl", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80")
                .append("verified", true)
                .append("active", true)
                .append("createdAt", createdAt)
                .append("updatedAt", LocalDateTime.now());
        return doc;
    }

    private Document menuDoc(String id, String restaurantId, String name, String category, double price, boolean vegetarian, LocalDateTime now) {
        Document doc = new Document();
        doc.append("_id", id)
                .append("restaurantId", restaurantId)
                .append("name", name)
                .append("description", name + " crafted with quality ingredients")
                .append("category", category)
                .append("price", price)
                .append("discountedPrice", Math.max(99.0, price - 20))
                .append("imageUrl", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80")
                .append("vegetarian", vegetarian)
                .append("vegan", false)
                .append("available", true)
                .append("customizations", List.of())
                .append("rating", 4.2)
                .append("createdAt", now.minusDays(6));
        return doc;
    }

    private Document couponDoc(String id, String code, String discountType, double discountValue, double minOrderAmount,
                               LocalDateTime validFrom, LocalDateTime validUntil, List<String> restaurantIds) {
        Document doc = new Document();
        doc.append("_id", id)
                .append("code", code)
                .append("description", code + " promotional discount")
                .append("discountType", discountType)
                .append("discountValue", discountValue)
                .append("maxDiscountAmount", 120.0)
                .append("minOrderAmount", minOrderAmount)
                .append("validFrom", validFrom)
                .append("validUntil", validUntil)
                .append("usageLimit", 8000)
                .append("usedCount", 220)
                .append("active", true)
                .append("applicableRestaurantIds", restaurantIds);
        return doc;
    }

    private Document addressDoc(String id, String label, String street, String city, String state,
                                String pincode, double latitude, double longitude, boolean isDefault) {
        Document doc = new Document();
        doc.append("id", id)
                .append("label", label)
                .append("street", street)
                .append("city", city)
                .append("state", state)
                .append("pincode", pincode)
                .append("latitude", latitude)
                .append("longitude", longitude)
                .append("default", isDefault)
                .append("isDefault", isDefault);
        return doc;
    }

    private Document openingHoursDoc() {
        Document slot = new Document();
        slot.append("openTime", "10:00").append("closeTime", "23:30").append("closed", false).append("isClosed", false);

        Document hours = new Document();
        hours.append("MON", slot)
                .append("TUE", slot)
                .append("WED", slot)
                .append("THU", slot)
                .append("FRI", slot)
                .append("SAT", slot)
                .append("SUN", slot);
        return hours;
    }

    private void upsert(String collection, Document doc) {
        Object id = doc.get("_id");
        if (id == null) {
            return;
        }

        mongoTemplate
                .getCollection(collection)
                .replaceOne(new Document("_id", id), doc, new ReplaceOptions().upsert(true));
    }
}
