import {
  Anchor,
  Button,
  ButtonIcon,
  H1,
  Paragraph,
  Separator,
  Sheet,
  Stack,
  SwitchRouterButton,
  SwitchThemeButton,
  useToastController,
  XStack,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useLink } from 'solito/navigation'
import { Heart, History, Home, Settings as SettingsIcon, Thermometer, Sparkles } from 'lucide-react'

type Tab = 'home' | 'favorites' | 'history' | 'settings'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const linkProps = useLink({
    href: `${linkTarget}/nate`,
  })
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <YStack flex={1} justify="center" items="center" gap="$8" p="$4" bg="$background">
      <Stack flex={1}>
        {activeTab === 'home' && <>ホーム</>}
        {activeTab === 'favorites' && <>お気に入り</>}
        {activeTab === 'history' && <>履歴</>}
        {activeTab === 'settings' && <>設定</>}
      </Stack>
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 shadow-2xl"> */}
      <XStack width={100} justify="center" alignItems="center">
        {[
          { id: 'home', icon: Home, label: 'ホーム' },
          { id: 'favorites', icon: Heart, label: 'お気に入り' },
          { id: 'history', icon: History, label: '履歴' },
          { id: 'settings', icon: SettingsIcon, label: '設定' },
        ].map((tab) => (
          <Button
            key={tab.id}
            onPress={() => setActiveTab(tab.id as Tab)}
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding="$1"
            transition="all 0.2s ease-in-out"
            borderRadius="$4"
            className={`${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg transform scale-105'
                : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </Button>
        ))}
      </XStack>
      {/* </div> */}
      {/* <SheetDemo /> */}
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$shadow4"
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame items="center" justify="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph text="center">Made by</Paragraph>
            <Anchor color="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
