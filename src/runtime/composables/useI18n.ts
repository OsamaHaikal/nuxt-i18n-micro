import type { PluginsInjections } from '../plugins/01.plugin'
import { useNuxtApp } from '#imports'

export function useI18n(): PluginsInjections {
  const nuxtApp = useNuxtApp()

  return {
    $getLocale: nuxtApp.$getLocale,
    $getLocales: nuxtApp.$getLocales,
    $t: nuxtApp.$t,
    $has: nuxtApp.$has,
    $tc: nuxtApp.$tc,
    $mergeTranslations: nuxtApp.$mergeTranslations,
    $switchLocale: nuxtApp.$switchLocale,
    $localeRoute: nuxtApp.$localeRoute,
    $loadPageTranslations: nuxtApp.$loadPageTranslations,
  } as const
}
