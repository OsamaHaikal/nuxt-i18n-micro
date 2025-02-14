import type { ModuleOptions } from '../../module'
import type { Translations } from '../plugins/01.plugin'
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from '#app'
import { useRoute, useRouter } from '#imports'

interface State extends ModuleOptions {
  rootDir: string
}

// Тип для локалей
type LocalesObject = Record<string, Translations>

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()

  const i18nConfig: State = config.public.i18nConfig as State

  // Функция нормализации, которая объединяет массивы и объекты в единый массив строк
  const normalizeLocales = (locales?: string[] | LocalesObject): LocalesObject => {
    if (Array.isArray(locales)) {
      // Если передан массив, преобразуем его в объект с пустыми значениями
      return locales.reduce((acc, locale) => {
        acc[locale] = {}
        return acc
      }, {} as LocalesObject)
    }
    else if (typeof locales === 'object' && locales !== null) {
      // Если передан объект, возвращаем его как есть
      return locales
    }
    return {}
  }

  // Функция для определения i18n маршрута
  const defineI18nRoute = (routeDefinition: { locales?: string[] | Record<string, Record<string, string>> }) => {
    const currentLocale = (route.params.locale || i18nConfig.defaultLocale!).toString()
    const normalizedLocales = normalizeLocales(routeDefinition.locales)
    const { name } = route

    // Если текущая локаль есть в объекте locales
    if (normalizedLocales[currentLocale]) {
      const translation = normalizedLocales[currentLocale]
      const nuxtApp = useNuxtApp()
      nuxtApp.$mergeTranslations(translation)
    }
    else {
      // Если локаль не допустима, перенаправляем на дефолтную локаль
      let defaultRouteName = name?.toString().replace('localized-', '')
      const resolvedRoute = router.resolve({ name: defaultRouteName })
      const newParams = { ...route.params }
      delete newParams.locale

      if (i18nConfig.includeDefaultLocaleRoute) {
        defaultRouteName = `localized-${defaultRouteName}`
        newParams.locale = i18nConfig.defaultLocale!
      }

      return router.push(resolvedRoute)
    }
  }

  // Предоставляем функцию в Nuxt контексте
  return {
    provide: {
      defineI18nRoute,
    },
  }
})
