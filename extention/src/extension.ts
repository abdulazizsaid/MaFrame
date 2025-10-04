import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const provider = vscode.languages.registerCompletionItemProvider(
    ['html', 'javascript'],
    {
      provideCompletionItems() {
        const completions = [
          new vscode.CompletionItem('v-model', vscode.CompletionItemKind.Keyword),
          new vscode.CompletionItem('{{ message }}', vscode.CompletionItemKind.Snippet),
          new vscode.CompletionItem('createApp', vscode.CompletionItemKind.Function)
        ];
        return completions;
      }
    },
    '{', 'v' // trigger characters
  );

  context.subscriptions.push(provider);
}
