import { Product } from '../models/types';

export function getProductFallbackUrl(product: Product): string {
  const subCategory = (product as any).subCategory || '';
  // Derive brand from product name since Product interface has no 'brand' field
  const name = (product.name || '').toLowerCase();
  const brand = name;
  const id = product.id;

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Default fallback
  let fallbackUrl = '/assets/mobiles%20and%20laptops/phone.webp';

  if (subCategory === 'Mobiles') {
    if (brand.includes('apple') || name.includes('iphone')) return '/assets/mobiles%20and%20laptops/17pro.webp';
    if (name.includes('fold 6')) return '/assets/mobiles%20and%20laptops/samsung_galaxy_z_fold_6.webp';
    if (name.includes('s23 fe')) return '/assets/mobiles%20and%20laptops/samsung_galaxy_s23_fe.webp';
    if (name.includes('m35 5g')) return '/assets/mobiles%20and%20laptops/samsung_galaxy_m35_5g.webp';
    if (brand.includes('samsung') || name.includes('galaxy')) return '/assets/mobiles%20and%20laptops/s26ultra.webp';
    if (brand.includes('oneplus')) return '/assets/mobiles%20and%20laptops/oneplus.webp';
    if (brand.includes('nothing')) return '/assets/mobiles%20and%20laptops/nothing3.webp';
    if (brand.includes('motorola')) return '/assets/mobiles%20and%20laptops/motrolaedge70.webp';
    if (brand.includes('iqoo') || brand.includes('vivo') || brand.includes('oppo') || brand.includes('xiaomi')) {
      const options = ['iqoo15gr.webp', 'phone.webp'];
      return `/assets/mobiles%20and%20laptops/${options[hash % options.length]}`;
    }
    return '/assets/mobiles%20and%20laptops/phone.webp';
  }

  if (subCategory === 'Laptops') {
    if (brand.includes('apple') || name.includes('macbook')) return '/assets/mobiles%20and%20laptops/mac1lap.webp';
    if (brand.includes('dell')) return '/assets/mobiles%20and%20laptops/delllap.webp';
    if (brand.includes('asus') || brand.includes('rog') || brand.includes('tuf')) return '/assets/mobiles%20and%20laptops/asuslap.webp';
    if (brand.includes('acer')) {
      const options = ['acerlap.webp', 'acer1lap.webp', 'acer3lap.webp'];
      return `/assets/mobiles%20and%20laptops/${options[hash % options.length]}`;
    }
    if (brand.includes('lenovo')) {
      if (name.includes('ideapad')) return '/assets/mobiles%20and%20laptops/ideapadlap.webp';
      return '/assets/mobiles%20and%20laptops/lenovolap.webp';
    }
    const fallbacks = ['delllap.webp', 'asuslap.webp', 'lenovolap.webp'];
    return `/assets/mobiles%20and%20laptops/${fallbacks[hash % fallbacks.length]}`;
  }

  if (subCategory === 'Tablets') {
    if (brand.includes('apple') || (name.includes('ipad') && !name.includes('xiomipad') && !name.includes('xiaomi') && !name.includes('redmi'))) return '/assets/mobiles%20and%20laptops/apple_ipad.webp';
    if (brand.includes('xiaomi') || name.includes('pad')) return '/assets/mobiles%20and%20laptops/xiomipad.webp';
    if (brand.includes('lenovo')) return '/assets/mobiles%20and%20laptops/lenova_pad.webp';
    return '/assets/mobiles%20and%20laptops/xiomipad.webp';
  }

  if (subCategory === 'Headphones') {
    const localHeadphones = ['/assets/deal-of-the-day/earpod_deal.webp', '/assets/flat_50/headphone.webp'];
    return localHeadphones[hash % localHeadphones.length];
  }

  if (product.categoryId === 'books') {
    const bookIndex = (hash % 10) + 1;
    return `/assets/books/book${bookIndex}.webp`;
  }

  if (product.categoryId === 'household-appliances') {
    if (name.includes('ac') || name.includes('conditioner')) return '/assets/household/AC.webp';
    if (name.includes('fan')) return '/assets/household/fan.webp';
    if (name.includes('fridge') || name.includes('refrigerator')) return '/assets/household/fridge.webp';
    if (name.includes('sofa')) return '/assets/household/sofa.webp';
    if (name.includes('table') || name.includes('chair')) return '/assets/household/table_with_chair.webp';
    if (name.includes('mop')) return '/assets/household/mop.webp';
    if (name.includes('rack') || name.includes('shelf')) return '/assets/household/bathroomshelfrack.webp';
    if (name.includes('bean bag')) return '/assets/household/bean_bag.webp';
    if (name.includes('drying')) return '/assets/household/drying_stand.webp';
    if (name.includes('sandwich')) return '/assets/household/sandwichmaker.webp';
    if (name.includes('oven') || name.includes('microwave')) return '/assets/household/oven.webp';
    if (name.includes('mixie') || name.includes('grinder')) return '/assets/household/mixie.webp';
    if (name.includes('mixer')) return '/assets/household/mixer.webp';
    
    const options = [
      '/assets/household/mixer.webp',
      '/assets/household/mixie.webp',
      '/assets/household/oven.webp',
      '/assets/household/sandwichmaker.webp'
    ];
    return options[hash % options.length];
  }

  if (product.categoryId === 'sports-fitness') {
    if (name.includes('shoe') || name.includes('boot') || subCategory === 'Footwear') {
      return '/assets/sports%20and%20fitness/boot.webp';
    }
    if (name.includes('cycle') || name.includes('cycling')) return '/assets/sports%20and%20fitness/cylcling%20machine.webp';
    if (name.includes('dumbbell') || name.includes('dumbell')) return '/assets/sports%20and%20fitness/dembell.webp';
    if (name.includes('kettlebell')) return '/assets/sports%20and%20fitness/kettlebell.webp';
    if (name.includes('football') || name.includes('ball')) return '/assets/sports%20and%20fitness/football.webp';
    if (name.includes('racket') || name.includes('badminton')) return '/assets/sports%20and%20fitness/racket.webp';
    if (name.includes('shuttle')) return '/assets/sports%20and%20fitness/shuttle.webp';
    if (name.includes('holder')) return '/assets/sports%20and%20fitness/arm%20holder.webp';
    if (name.includes('treadmill')) return '/assets/sports%20and%20fitness/machine.webp';
    
    const options = [
      '/assets/sports%20and%20fitness/machine.webp',
      '/assets/sports%20and%20fitness/machine2.webp',
      '/assets/sports%20and%20fitness/dembell.webp'
    ];
    return options[hash % options.length];
  }

  if (product.categoryId === 'mens-fashion') {
    if (subCategory === 'Shoes') {
      const options = ['shoe.webp', 'shoe1.webp', 'shoe4.webp', 'adidas_shoe.webp'];
      return `/assets/mens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Shirts') {
      const options = ['shirt1.webp', 'shirt2.webp'];
      return `/assets/mens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Pants') return '/assets/mens%20fashion/pant.webp';
    if (subCategory === 'Glasses') {
      const options = ['sunglass.webp', 'sunglass2.webp'];
      return `/assets/mens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Wallets') {
      const options = ['wallet.webp', 'wallet2.webp'];
      return `/assets/mens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Belts') return '/assets/mens%20fashion/belt.webp';
    if (subCategory === 'Watches') {
      const options = ['watch.webp', 'watch1.webp', 'watch2.webp'];
      return `/assets/mens%20fashion/${options[hash % options.length]}`;
    }
    return '/assets/mens%20fashion/dress.webp';
  }

  if (product.categoryId === 'womens-fashion') {
    if (subCategory === 'Dresses') {
      const options = ['dress.webp', 'dress2.webp', 'dress3.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Handbags') {
      const options = ['bag1.webp', 'bag2.webp', 'bag3.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Jewellery') {
      const options = ['bracelet.webp', 'goldring1.webp', 'goldring2.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Cosmetics') {
      const options = ['foundation1.webp', 'foundation2.webp', 'foundatio3.webp', 'foundation4.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Shoes') return '/assets/womens%20fashion/shoe4.webp';
    if (subCategory === 'Glasses') {
      const options = ['sunglass1.webp', 'sunglass2.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    if (subCategory === 'Watches') {
      const options = ['watch1.webp', 'watch2.webp', 'watch3.webp'];
      return `/assets/womens%20fashion/${options[hash % options.length]}`;
    }
    return '/assets/womens%20fashion/dress.webp';
  }

  return fallbackUrl;
}

export function handleImageFallback(event: any, product: Product) {
  const fallbackUrl = getProductFallbackUrl(product);
  if (event.target.src !== window.location.origin + fallbackUrl && event.target.src !== fallbackUrl) {
    event.target.src = fallbackUrl;
  }
}
