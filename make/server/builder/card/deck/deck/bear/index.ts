import { Scope, ScopeType, api } from '~server'

export function finalize_deckCard_deck_bear(
  scope: ScopeType<Scope.Nest, ScopeType<Scope.DeckCard>>,
): void {
  const nest = scope.data.nest.nest[0]
  if (nest) {
    const text = api.resolveText(scope)
    if (scope.parent) {
      scope.parent.data.card.deck.bear = text
    }
  }
}

export function process_deckCard_deck_bear(
  scope: ScopeType<Scope.Nest, ScopeType<Scope.DeckCard>>,
): void {
  const nest = scope.data.nest.nest[0]
  if (nest) {
    const dependencyList = api.resolveTextDependencyList(nest)
    api.processDependencyList(
      dependencyList,
      scope,
      api.finalize_deckCard_deck_bear,
    )
  }
}