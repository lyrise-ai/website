import { sections } from './sections.config'

export class PageConfigBuilder {
  constructor() {
    this.sections = []
  }

  addSection(name, props) {
    if (!sections.has(name)) {
      throw new Error(`Invalid section: ${name}`)
    }
    this.sections.push([name, props])
    return this
  }

  build() {
    return this.sections
  }
}
