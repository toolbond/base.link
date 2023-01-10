import { Base, DEFAULT_CONTAINER_SCOPE, Mesh, Nest, code } from '~'
import type {
  MeshCodeModuleType,
  NestCodeModuleType,
  SiteProcessInputType,
} from '~'

export * from './bear/index.js'
export * from './bind/index.js'
export * from './bond/index.js'
export * from './call/index.js'
export * from './face/index.js'
export * from './form/index.js'
export * from './fuse/index.js'
export * from './head/index.js'
export * from './hide/index.js'
export * from './hold/index.js'
export * from './hook/index.js'
export * from './host/index.js'
export * from './like/index.js'
export * from './link/index.js'
export * from './load/index.js'
export * from './note/index.js'
export * from './risk/index.js'
export * from './save/index.js'
export * from './show/index.js'
export * from './slot/index.js'
export * from './stem/index.js'
export * from './suit/index.js'
export * from './take/index.js'
export * from './task/index.js'
export * from './term/index.js'
export * from './test/index.js'
export * from './time/index.js'
export * from './tree/index.js'
export * from './void/index.js'
export * from './wait/index.js'
export * from './walk/index.js'
export * from './zone/index.js'

export function handle_codeCard(base: Base, link: string): void {
  if (code.hasModuleByPath(base, link)) {
    return
  }

  code.process_codeCard(base, link)
  code.resolve_codeCard(base, link)
}

export function process_codeCard(base: Base, link: string): void {
  const parse = code.loadLinkModule(base, link)
  const card = base.card(link)
  const container = code.createContainerScope(DEFAULT_CONTAINER_SCOPE)
  const scope = code.createStepScope(container)
  const seed: NestCodeModuleType = {
    ...parse,
    base,
    children: [],
    id: card.id,
    isModule: true,
    like: Nest.CodeModule,
    scope,
  }

  const input: SiteProcessInputType = code.createInput(
    base,
    seed,
    scope,
    seed,
    seed,
  )

  card.bind(seed)

  if (seed.text.trim()) {
    code.processNestedChildren(
      input,
      seed.link,
      code.process_codeCard_nestedChildren,
    )
  }
}

export function process_codeCard_nestedChildren(
  input: SiteProcessInputType,
): void {
  const type = code.determineNestType(input)
  switch (type) {
    case 'dynamic-text':
    case 'dynamic-term':
      code.throwError(
        code.generateUnhandledTermInterpolationError(input),
      )
      break
    case 'static-term':
      code.process_codeCard_nestedChildren_staticTerm(input)
      break
    default: {
      code.throwError(code.generateUnhandledNestCaseError(input, type))
    }
  }
}

export function process_codeCard_nestedChildren_staticTerm(
  input: SiteProcessInputType,
): void {
  const term = code.resolveTerm(input)
  switch (term) {
    case 'bear': {
      code.process_codeCard_bear(input)
      break
    }
    case 'load': {
      code.process_codeCard_load(input)
      break
    }
    case 'fuse': {
      code.process_codeCard_fuse(input)
      break
    }
    case 'tree': {
      code.process_codeCard_tree(input)
      break
    }
    case 'face': {
      code.process_codeCard_face(input)
      break
    }
    case 'host': {
      code.process_codeCard_host(input)
      break
    }
    case 'form': {
      code.process_codeCard_form(input)
      break
    }
    case 'suit': {
      code.process_codeCard_suit(input)
      break
    }
    case 'task': {
      code.process_codeCard_task(input)
      break
    }
    case 'note': {
      code.process_codeCard_note(input)
      break
    }
    default: {
      code.throwError(code.generateUnhandledTermCaseError(input))
    }
  }
}

export function resolve_codeCard(base: Base, link: string): void {
  const card = base.card(link)

  if (code.isNest(card.seed, Nest.CodeModule)) {
    if (code.childrenAreMesh(card.seed)) {
      const seed: MeshCodeModuleType = {
        base: card.seed.base,
        callbacks: {},
        classInterfaces: {},
        classes: {},
        components: {},
        constants: {},
        directory: card.seed.directory,
        exports: [],
        functions: {},
        id: card.id,
        imports: [],
        isModule: true,
        like: Mesh.CodeModule,
        link: card.seed.link,
        nativeClassInterfaces: {},
        path: card.seed.path,
        public: {
          classInterfaces: {},
          classes: {},
          components: {},
          constants: {},
          functions: {},
          nativeClassInterfaces: {},
          templates: {},
          tests: {},
        },
        scope: card.seed.scope,
        templates: {},
        tests: {},
        text: card.seed.text,
        textByLine: card.seed.textByLine,
      }

      card.seed.children.forEach(node => {
        switch (node.like) {
          case Mesh.Constant: {
            code.assertMesh(node, Mesh.Constant)
            if (!node.hidden) {
              seed.public.constants[node.name] = node
            }
            seed.constants[node.name] = node
            break
          }
          case Mesh.ClassInterface: {
            code.assertMesh(node, Mesh.ClassInterface)
            if (!node.hidden) {
              seed.public.classInterfaces[node.name] = node
            }
            seed.classInterfaces[node.name] = node
            break
          }
          case Mesh.Function: {
            code.assertMesh(node, Mesh.Function)
            if (!node.hidden) {
              seed.public.functions[node.name] = node
            }
            seed.functions[node.name] = node
            break
          }
          case Mesh.Class: {
            code.assertMesh(node, Mesh.Class)
            if (!node.hidden) {
              seed.public.classes[node.name] = node
            }
            seed.classes[node.name] = node
            break
          }
          case Mesh.Template: {
            code.assertMesh(node, Mesh.Template)
            if (!node.hidden) {
              seed.public.templates[node.name] = node
            }
            seed.templates[node.name] = node
            break
          }
          case Mesh.Import: {
            code.assertMesh(node, Mesh.Import)
            seed.imports.push(node)
            break
          }
          case Mesh.Export: {
            code.assertMesh(node, Mesh.Export)
            seed.exports.push(node)
            break
          }
          default:
            code.throwError(
              code.generatedNotImplementedYetError(node.like),
            )
        }
      })

      const input: SiteProcessInputType = code.createInput(
        base,
        card.seed,
        card.seed.scope,
        card.seed,
        card.seed,
      )

      code.replaceSeed(input, seed)

      seed.imports.forEach(node => {
        // HACK: TODO: figure out how to get the different file types.
        if (
          node.absolutePath.match('/drumwork/deck/([^/]+)/base.link')
        ) {
          code.handle_deckCard(seed.base, node.absolutePath)
        } else {
          code.handle_codeCard(seed.base, node.absolutePath)
        }
      })

      seed.exports.forEach(node => {
        // HACK: TODO: figure out how to get the different file types.
        if (
          node.absolutePath.match('/drumwork/deck/([^/]+)/base.link')
        ) {
          code.handle_deckCard(seed.base, node.absolutePath)
        } else {
          code.handle_codeCard(seed.base, node.absolutePath)
        }
      })
    } else {
      card.seed.children.forEach(node => {
        switch (node.like) {
          case Nest.Import:
            break
          case Nest.Export:
            break
          case Nest.Class: {
            break
          }
          case Nest.Function: {
            break
          }
          case Nest.Template: {
            break
          }
          case Nest.Inject: {
            break
          }
          case Mesh.Import:
            if (
              node.absolutePath.match(
                '/drumwork/deck/([^/]+)/base.link',
              )
            ) {
              code.handle_deckCard(base, node.absolutePath)
            } else {
              code.handle_codeCard(base, node.absolutePath)
            }
            break
          case Mesh.Export:
            break
          case Mesh.Class: {
            break
          }
          case Mesh.Function: {
            break
          }
          case Mesh.Template: {
            break
          }
          case Mesh.Inject: {
            break
          }
          default:
            code.throwError(
              code.generatedNotImplementedYetError(node.like),
            )
        }
      })
    }
  }
}
