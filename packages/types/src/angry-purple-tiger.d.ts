declare module "angry-purple-tiger" {
  /**
   * Generates an animal-based name from a given input string.
   *
   * @param input - The input string to generate a name from. Typically a Helium hotspot ID.
   * @returns The generated animal-based name.
   */
  function animalHash(input: string): string;

  /**
   * Generates an animal-based name from a given input string.
   * This is an alias for the animalHash function.
   *
   * @param input - The input string to generate a name from. Typically a Helium hotspot ID.
   * @returns The generated animal-based name.
   */
  function generate(input: string): string;

  export { animalHash, generate };
}
