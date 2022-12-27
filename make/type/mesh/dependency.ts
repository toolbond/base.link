import { APIInputType } from '~'

import { AST } from './list'

export type ASTBindableObjectType = {
  // callbacks to the dependency handler
  // then the dependency handler calls back to
  // the original source compiler handler
  callbackList: Array<
    ASTInputCallbackType<Record<string, unknown>>
  >
  data: Record<string, unknown>
  like: AST.BindableObject
  parent?: ASTBindableObjectType
}

export type ASTBindableStringType = {
  callbackList: Array<ASTInputCallbackType<string>>
  data: string
  like: AST.BindableString
  parent?: ASTBindableObjectType
}

export type ASTDependencyPartCallbackType = (
  value: unknown,
) => void

export type ASTDependencyPartType = {
  callbackList: Array<ASTDependencyPartCallbackType>
  last?: ASTDependencyPartType
  like: AST.DependencyPart
  met: boolean
  name: string
  next?: ASTDependencyPartType
  parent: ASTDependencyType
}

export type ASTDependencyType = {
  callbackList: Array<ASTInputCallbackType<APIInputType>>
  context: APIInputType
  like: AST.Dependency
  met: boolean
  path: Array<ASTDependencyPartType>
}

export type ASTInputCallbackType<T> = (value: T) => void

export type ASTLexicalScopeType = {
  data: Record<string, unknown>
  like: AST.LexicalScope
  parent?: ASTLexicalScopeType
}
