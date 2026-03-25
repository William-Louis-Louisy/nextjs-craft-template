import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function Logo() {
  return (
    <Link href={'/'} className="inline-flex items-center gap-4">
      <div className="relative size-10 overflow-hidden rounded-full">
        <Image src="/bakerscript.png" alt="logo" fill sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <span className="text-xl font-black">BakerScript</span>
    </Link>
  );
}
