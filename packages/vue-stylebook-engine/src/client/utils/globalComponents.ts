import type { Component as VueComponent } from 'vue'

const globalComponents: Record<string, VueComponent> = {}

export function registerGlobalComponents(app: any): any{
  Object.entries(globalComponents)
    .forEach(([name, component]) => {
      app.component(name, component)
    })
  return app
}

export function addGlobalComponentToRegistration(name: string, component: VueComponent) {
  globalComponents[name] = component
}