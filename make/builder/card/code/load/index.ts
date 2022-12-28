import { AST, Nest, api } from '~'
import type { APIInputType, ASTPartialType } from '~'

export * from './bear/index.js'
export * from './find/index.js'

export function finalize_codeCard_load_textNest(
  input: APIInputType,
): void {
  const text = api.resolveText(input)

  api.assertString(text)

  const card = api.getProperty(input, 'card')

  api.assertASTPartial(card, AST.CodeModule)

  const path = api.resolveModulePath(input, text)

  const load = api.assumeInputObjectAsASTPartialType(
    input,
    AST.Import,
  )

  load.children.push(
    api.createStringConstant('absolutePath', path),
  )
}

export function process_codeCard_load(
  input: APIInputType,
): void {
  const load: ASTPartialType<AST.Import> = {
    children: [],
    like: AST.Import,
    partial: true,
  }

  api.assertAST(input.card, AST.CodeModule)

  input.card.loadList.push(load)

  const childInput = api.extendWithObjectScope(input, load)

  api.assumeNest(input).nest.forEach((nest, index) => {
    process_codeCard_load_nestedChildren(
      api.extendWithNestScope(childInput, {
        index,
        nest,
      }),
    )
  })
}

export function process_codeCard_load_nestedChildren(
  input: APIInputType,
) {
  const type = api.determineNestType(input)
  switch (type) {
    case Nest.StaticText: {
      const index = api.assumeNestIndex(input)
      if (index !== 0) {
        throw new Error('Oops')
      } else {
        api.finalize_codeCard_load_textNest(input)
      }
      break
    }

    case Nest.StaticTerm: {
      const term = api.resolveStaticTermFromNest(input)
      switch (term) {
        case 'find':
        case 'take':
          api.process_codeCard_load_find(input)
          break
        case 'load':
          api.process_codeCard_load(input)
          break
        case 'bear':
          api.process_codeCard_load_bear(input)
          break
        default:
          api.throwError(api.generateUnknownTermError(input))
      }
      break
    }

    default:
      api.throwError(
        api.generateUnhandledNestCaseError(input, type),
      )
  }
}