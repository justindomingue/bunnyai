import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

/** Renders Noun avatar with fallback */
export function Noun({}: {}) {
  return (
    <Avatar>
      <AvatarImage src="/noun1.png" alt="noun1" />
      <AvatarFallback>N</AvatarFallback>
    </Avatar>
  )
}
