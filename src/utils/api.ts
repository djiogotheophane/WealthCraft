/**
 * Safely handles fetch responses, checking for correct Content-Type and HTTP status before parsing JSON.
 * This prevents SyntaxErrors like "Unexpected token < in JSON..." or "Unexpected token 'T',..."
 * when the server returns HTML/text (like a 404/500 error page).
 */
export async function handleApiResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (response.ok) {
    if (isJson) {
      try {
        return await response.json();
      } catch (jsonErr) {
        throw new Error("Le serveur a renvoyé un format JSON invalide.");
      }
    } else {
      // Return plain text if not JSON but response was OK
      const text = await response.text();
      return { success: true, text };
    }
  } else {
    // Handling error responses (4xx, 5xx)
    if (isJson) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur de communication (Code ${response.status})`);
      } catch (e: any) {
        throw new Error(e.message || `Une erreur est survenue (Code ${response.status})`);
      }
    } else {
      const text = await response.text();
      
      // If the response is HTML (starts with <)
      if (text.trim().startsWith("<")) {
        const titleMatch = text.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : null;
        const h1Match = text.match(/<h1>(.*?)<\/h1>/i);
        const h1 = h1Match ? h1Match[1] : null;
        
        const details = title || h1 || "Page d'erreur ou maintenance serveur.";
        throw new Error(`[Erreur ${response.status}] Le serveur a renvoyé une page HTML : "${details}"`);
      } else {
        // Plain text error
        const cleanText = text.trim();
        const displayError = cleanText.length > 100 ? `${cleanText.substring(0, 100)}...` : cleanText;
        throw new Error(`[Erreur ${response.status}] ${displayError || "Réponse serveur vide."}`);
      }
    }
  }
}
