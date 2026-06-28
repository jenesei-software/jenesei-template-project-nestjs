export interface ICliCommand {
  /**
   * Метод, который запускает логику команды.
   * @param params – распарсенные флаги из консоли (например: { id: "10", force: true })
   */
  execute(params: Record<string, unknown>): Promise<unknown>;
}
