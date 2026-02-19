export type MenuCategory = "starters" | "main" | "south-indian" | "beverages" | "desserts"
export type SpiceLevel = "mild" | "medium" | "hot" | "extra-hot"
export type PortionSize = "half" | "full" | "family"

export interface AddOn {
  id: string
  name: string
  price: number
}

export interface Topping {
  id: string
  name: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: MenuCategory
  image: string
  canCustomizeSpice?: boolean
  defaultSpice?: SpiceLevel
  rating?: number
  vegType?: "veg" | "non-veg"
  popular?: boolean
  availablePortions?: PortionSize[]
  portionPrices?: Record<PortionSize, number>
  availableAddOns?: AddOn[]
  availableToppings?: Topping[]
}

export interface CartItem {
  id: string
  menuItemId: number
  name: string
  price: number
  quantity: number
  spiceLevel?: SpiceLevel
  portionSize?: PortionSize
  selectedAddOns?: AddOn[]
  selectedToppings?: Topping[]
  specialInstructions?: string
  itemTotal: number
}

export interface OrderItem {
  id: string
  menuItemId: number
  quantity: number
  spiceLevel?: SpiceLevel
  specialInstructions?: string
  timestamp: Date
}

export const spiceLevels: { id: SpiceLevel; label: string; description: string }[] = [
  { id: "mild", label: "Mild", description: "Gentle and subtle" },
  { id: "medium", label: "Medium", description: "Balanced heat" },
  { id: "hot", label: "Hot", description: "Spicy kick" },
  { id: "extra-hot", label: "Extra Hot", description: "Intense heat" },
]

export const portionSizes: { id: PortionSize; label: string }[] = [
  { id: "half", label: "Half" },
  { id: "full", label: "Full" },
  { id: "family", label: "Family (2-3 servings)" },
]

export const commonAddOns: AddOn[] = [
  { id: "extra-sauce", name: "Extra Sauce", price: 20 },
  { id: "extra-cheese", name: "Extra Cheese", price: 30 },
  { id: "extra-paneer", name: "Extra Paneer", price: 40 },
  { id: "mayo", name: "Extra Mayo", price: 15 },
]

export const commonToppings: Topping[] = [
  { id: "onion", name: "Onions" },
  { id: "cilantro", name: "Fresh Cilantro" },
  { id: "jalapeño", name: "Jalapeños" },
  { id: "lemon", name: "Lemon Wedges" },
  { id: "pickle", name: "Mixed Pickle" },
]

export const categories: { id: MenuCategory; label: string; emoji: string }[] = [
  { id: "starters", label: "Starters", emoji: "🥟" },
  { id: "main", label: "Main Course", emoji: "🍛" },
  { id: "south-indian", label: "South Indian Specials", emoji: "🥞" },
  { id: "beverages", label: "Beverages", emoji: "☕" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
]

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: "Gobi Manchurian",
    description: "Crispy cauliflower florets tossed in a spicy Indo-Chinese sauce with bell peppers and onions.",
    price: 180,
    category: "starters",
    image: "/gobi-manchurian-crispy-cauliflower-indo-chinese-di.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
    rating: 4.2,
    vegType: "veg",
    popular: true,
    availablePortions: ["half", "full"],
    portionPrices: { half: 140, full: 180, family: 300 },
    availableAddOns: [commonAddOns[1]],
    availableToppings: [commonToppings[0], commonToppings[1]],
  },
  {
    id: 2,
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled to perfection in a tandoor with mint chutney.",
    price: 220,
    category: "starters",
    image: "/paneer-tikka-grilled-indian-appetizer.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
    rating: 4.5,
    vegType: "veg",
    popular: true,
    availablePortions: ["half", "full"],
    portionPrices: { half: 160, full: 220, family: 380 },
    availableAddOns: [],
    availableToppings: [commonToppings[1], commonToppings[3]],
  },
  {
    id: 3,
    name: "Baby Corn 65",
    description: "Tender baby corn coated in spiced batter and deep-fried until golden and crispy.",
    price: 160,
    category: "starters",
    image: "/baby-corn-65-crispy-fried-indian-starter.jpg",
    canCustomizeSpice: true,
    defaultSpice: "hot",
    rating: 4.0,
    vegType: "veg",
    availablePortions: ["half", "full"],
    portionPrices: { half: 120, full: 160, family: 270 },
    availableAddOns: [commonAddOns[0]],
    availableToppings: [commonToppings[0]],
  },
  // Main Course
  {
    id: 4,
    name: "Veg Biryani",
    description: "Aromatic basmati rice layered with mixed vegetables, herbs, and traditional spices.",
    price: 250,
    category: "main",
    image: "/vegetable-biryani-indian-rice-dish.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
    rating: 4.6,
    vegType: "veg",
    popular: true,
    availablePortions: ["full", "family"],
    portionPrices: { half: 250, full: 250, family: 450 },
    availableAddOns: [commonAddOns[2]],
    availableToppings: [commonToppings[1], commonToppings[4]],
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in a rich, creamy tomato-based gravy with aromatic spices.",
    price: 280,
    category: "main",
    image: "/paneer-butter-masala-creamy-indian-curry.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
    rating: 4.7,
    vegType: "veg",
    popular: true,
    availablePortions: ["full", "family"],
    portionPrices: { half: 280, full: 280, family: 500 },
    availableAddOns: [commonAddOns[0], commonAddOns[2]],
    availableToppings: [commonToppings[1]],
  },
  {
    id: 6,
    name: "Dal Makhani",
    description: "Slow-cooked black lentils simmered in butter and cream with Indian spices.",
    price: 200,
    category: "main",
    image: "/dal-makhani-black-lentils-indian-dish.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
    rating: 4.4,
    vegType: "veg",
    availablePortions: ["full", "family"],
    portionPrices: { half: 200, full: 200, family: 350 },
    availableAddOns: [commonAddOns[0]],
    availableToppings: [commonToppings[1]],
  },
  // South Indian Specials
  {
    id: 7,
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato masala, served with sambar and chutneys.",
    price: 120,
    category: "south-indian",
    image: "/masala-dosa-crispy-south-indian-crepe-with-potato-.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
    rating: 4.5,
    vegType: "veg",
    popular: true,
    availablePortions: ["half", "full"],
    portionPrices: { half: 100, full: 120, family: 200 },
    availableAddOns: [commonAddOns[0], commonAddOns[2]],
    availableToppings: [commonToppings[0], commonToppings[1]],
  },
  {
    id: 8,
    name: "Idli Sambar",
    description: "Steamed rice cakes served with aromatic lentil soup and coconut chutney.",
    price: 80,
    category: "south-indian",
    image: "/idli-sambar-south-indian-breakfast.jpg",
    canCustomizeSpice: true,
    defaultSpice: "mild",
    rating: 4.3,
    vegType: "veg",
    availablePortions: ["half", "full"],
    portionPrices: { half: 60, full: 80, family: 140 },
    availableAddOns: [commonAddOns[0]],
    availableToppings: [commonToppings[1]],
  },
  {
    id: 9,
    name: "Medu Vada",
    description: "Crispy fried lentil donuts served with sambar and fresh coconut chutney.",
    price: 70,
    category: "south-indian",
    image: "/medu-vada-crispy-south-indian-lentil-donut.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
    rating: 4.2,
    vegType: "veg",
    availablePortions: ["half", "full"],
    portionPrices: { half: 50, full: 70, family: 120 },
    availableAddOns: [],
    availableToppings: [commonToppings[0]],
  },
  {
    id: 10,
    name: "Uttapam",
    description: "Thick rice pancake topped with onions, tomatoes, and green chilies.",
    price: 100,
    category: "south-indian",
    image: "/uttapam-south-indian-pancake-with-vegetables.jpg",
    canCustomizeSpice: true,
    defaultSpice: "medium",
    rating: 4.1,
    vegType: "veg",
    availablePortions: ["half", "full"],
    portionPrices: { half: 80, full: 100, family: 170 },
    availableAddOns: [commonAddOns[2]],
    availableToppings: [commonToppings[0], commonToppings[1], commonToppings[2]],
  },
  // Beverages
  {
    id: 11,
    name: "Filter Coffee",
    description: "Traditional South Indian coffee brewed fresh and served in a steel tumbler.",
    price: 40,
    category: "beverages",
    image: "/south-indian-filter-coffee-steel-tumbler.jpg",
    rating: 4.4,
    vegType: "veg",
    popular: true,
  },
  {
    id: 12,
    name: "Masala Tea",
    description: "Aromatic tea infused with cardamom, ginger, and traditional spices.",
    price: 35,
    category: "beverages",
    image: "/masala-chai-indian-spiced-tea.jpg",
    rating: 4.3,
    vegType: "veg",
  },
  {
    id: 13,
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water, available sweet or salted.",
    price: 50,
    category: "beverages",
    image: "/fresh-lime-soda-refreshing-drink.jpg",
    rating: 4.2,
    vegType: "veg",
  },
  {
    id: 14,
    name: "Mango Lassi",
    description: "Creamy yogurt drink blended with sweet Alphonso mangoes.",
    price: 80,
    category: "beverages",
    image: "/mango-lassi-indian-yogurt-drink.jpg",
    rating: 4.5,
    vegType: "veg",
    popular: true,
  },
  // Desserts
  {
    id: 15,
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup, served warm.",
    price: 80,
    category: "desserts",
    image: "/gulab-jamun-indian-sweet-dessert-in-syrup.jpg",
    rating: 4.6,
    vegType: "veg",
    popular: true,
  },
  {
    id: 16,
    name: "Ice Cream",
    description: "Creamy homemade ice cream in flavors like mango, pistachio, and butterscotch.",
    price: 90,
    category: "desserts",
    image: "/indian-ice-cream-mango-pistachio-kulfi.jpg",
    rating: 4.7,
    vegType: "veg",
    popular: true,
  },
  {
    id: 17,
    name: "Kesari Bath",
    description: "Traditional semolina pudding flavored with saffron, ghee, and cashews.",
    price: 70,
    category: "desserts",
    image: "/kesari-bath-saffron-semolina-halwa.jpg",
    rating: 4.3,
    vegType: "veg",
  },
  {
    id: 18,
    name: "Rasmalai",
    description: "Soft cottage cheese patties in sweetened, cardamom-infused milk.",
    price: 100,
    category: "desserts",
    image: "/rasmalai-indian-milk-dessert.jpg",
    rating: 4.5,
    vegType: "veg",
  },
]
