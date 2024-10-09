declare module "angry-purple-tiger" {
  /**
   * Generates an animal-based name from a given input string.
   *
   * @param input - The input string to generate a name from. Typically a Helium hotspot ID.
   * @returns The generated animal-based name.
   */
  function animalHash(
    input: string,
    options?: { separator?: string; style?: "lowercase" | "uppercase" },
  ): string;

  export default animalHash;
}
