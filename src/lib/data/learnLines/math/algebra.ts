import type { LearnLine, TextContent } from '$lib/modules/maia/learnLine';

export const algebra: LearnLine[] = [
  {
    id: 'learnline:alg:ekv-losning-ensteg-addsub', // Mer specifikt ID
    // Behåll engelska fält för interna/default värden om systemet kräver det
    title: 'Lösning av enstegsekvationer med addition och subtraktion',
    description: 'Lär dig att lösa enstegsekvationer med addition och subtraktion.',
    example: 'x + 3 = 7 eller y - 5 = 2',
    prerequisites: [
        //"learnline:num:integer-ops", // Antagande att detta finns
        //"learnline:alg:variables-concept" // Antagande att detta finns
    ],
    tags: ['ekvationer', 'algebra', 'enstegsekvationer', 'addition', 'subtraktion'],
    steps: [
      // --- Steg 1: Introduktion ---
      {
        id: 'steg1-introduktion',
        title: 'Introduktion till Enstegsekvationer',
        content: [
          {
            id: 's1c1-text',
            contentType: 'text',
            text: 'Välkommen! I den här lektionen lär vi oss att lösa **enstegsekvationer**. Det är ekvationer där vi bara behöver använda *en* matematisk operation (som addition eller subtraktion) för att hitta värdet på den okända variabeln (oftast \'x\').',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's1c3-vis-exempel',
            contentType: 'visualization',
            text: 'Visualisering av en balanserad ekvation',
            config: {
                active: true,
                leftSide: '10', // Exemplet vi ska jobba med
                rightSide: '10',
                xValue: 4, // Systemet vet att x=4 balanserar detta
                showEvaluation: true // Visa numeriska värdet ovanför?
            } satisfies VisEquationBalanceConfig
          },
          {
            id: 's1c2-text',
            contentType: 'text',
            text: 'Tänk på en ekvation som en balansvåg. Båda sidorna måste väga lika mycket. Vårt mål är att ta reda på vad \'x\' är värt, genom att få \'x\' ensamt på ena sidan vågen, samtidigt som vi behåller balansen.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's1c3-vis-exempel',
            contentType: 'visualization',
            text: 'Visualisering av en balanserad ekvation',
            config: {
                active: true,
                leftSide: '5 * 🍎', // Exemplet vi ska jobba med
                rightSide: '20 * 🍎',
                xValue: 1, // Systemet vet att x=4 balanserar detta
                xSymbol: '🍎', // Använd en symbol istället för x
                showEvaluation: true // Visa numeriska värdet ovanför?
            } satisfies VisEquationBalanceConfig
          },
          {
            id: 's1c2.1-text',
            contentType: 'text',
            text: 'Ifall vi skulle ha 5 äpplen på vänster sida och 20 äpplen på höger sida, så kommer vågen att luta åt höger.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's1c2.2-text',
            contentType: 'text',
            text: 'Tänk att alltid hålla balansen i åtanke när vi löser ekvationer. Om vi lägger till eller tar bort något på ena sidan, måste vi göra samma sak på den andra sidan för att hålla vågen i balans.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's1c3-vis-exempel',
            contentType: 'visualization',
            text: 'Visualisering av en balanserad ekvation',
            config: {
                active: true,
                leftSide: 'x + 3', // Exemplet vi ska jobba med
                rightSide: '7',
                xValue: 4, // Systemet vet att x=4 balanserar detta
                xSymbol: 'x', // Använd x istället för äpplen
                showEvaluation: true // Visa numeriska värdet ovanför?
            } satisfies VisEquationBalanceConfig
          },
          {
            id: 's1c4-text',
            contentType: 'text',
            text: 'Titta på vågen till vänster. Den visar ekvationen `x + 3 = 7`. För att få reda på vad \'x\' är måste vi få bort `+ 3` från vänstra sidan. Hur gör vi det?',
            nextAction: 'continueButton'
          } satisfies TextContent,
        ],
        completionTrigger: 'continueButton' // Krävs för att gå till nästa STEG
      },
      // --- Steg 2: Lösa med Subtraktion (för Addition) ---
      {
        id: 'steg2-subtraktion',
        title: 'Lösa med Subtraktion',
        content: [
          {
            id: 's2c1-text',
            contentType: 'text',
            text: 'För att bli av med `+ 3` använder vi motsatsen (inversen) till addition, vilket är **subtraktion**. Vi måste alltså subtrahera 3.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's2c2-text',
            contentType: 'text',
            text: '**Viktig regel:** För att vågen ska förbli i balans måste vi *alltid* göra samma sak på båda sidor! Om vi subtraherar 3 från vänster sida, måste vi också subtrahera 3 från höger sida.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's2c3-vis-steg1',
            contentType: 'visualization',
            text: 'Visar subtraktion på båda sidor',
            config: { // Konfiguration för att ANIMERA subtraktionen
                leftSide: 'x + 3 - 3', // Starttillstånd för vänster
                rightSide: '7 - 3',    // Starttillstånd för höger
                xValue: 4
            } satisfies VisEquationBalanceConfig
          },
          {
            id: 's2c4-text',
            contentType: 'text',
            text: 'När vi subtraherar 3 från båda sidor ser ekvationen ut så här: `x + 3 - 3 = 7 - 3`.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's2c6-vis-resultat',
            contentType: 'visualization',
            text: 'Resultatet efter subtraktion',
            config: { // Sluttillståndet
                leftSide: 'x',
                rightSide: '4',
                xValue: 4,
                 showEvaluation: true
            } satisfies VisEquationBalanceConfig
          },
           {
            id: 's2c5-text',
            contentType: 'text',
            text: 'Förenkla nu båda sidor. På vänster sida tar `+ 3` och `- 3` ut varandra, kvar blir bara `x`. På höger sida blir `7 - 3` lika med `4`.',
            nextAction: 'continueButton'
          } satisfies TextContent,
           
           {
            id: 's2c7-text',
            contentType: 'text',
            text: 'Vågen är fortfarande i balans och vi ser nu att `x = 4`. Vi har löst ekvationen!',
            nextAction: 'continueButton'
          } satisfies TextContent,
        ],
         completionTrigger: 'continueButton'
      },
       // --- Steg 3: Övning (Subtraktion) ---
      {
        id: 'steg3-ovning-subtraktion',
        title: 'Övning (Lösa med Subtraktion)',
        content: [
          {
            id: 's3c1-text',
            contentType: 'text',
            text: 'Bra jobbat! Nu är det dags att öva. Lös följande ekvationer genom att subtrahera på båda sidor.',
          } satisfies TextContent,
          {
            id: 's3p1-problem',
            contentType: 'mathProblem',
            problem: 'x + 5 = 12',
            // Här kan assessment-logiken kopplas för att ge feedback och tracka velocity
            nextAction: 'continueButton' // Vänta på svar innan nästa problem
          } satisfies MathProblemContent,
          {
            id: 's3p2-problem',
            contentType: 'mathProblem',
            problem: 'y + 2 = 9',
            nextAction: 'continueButton'
          } satisfies MathProblemContent,
           {
            id: 's3p3-problem',
            contentType: 'mathProblem',
            problem: '8 + k = 11', // Variabel på annan plats
            nextAction: 'continueButton'
          } satisfies MathProblemContent
        ],
        completionTrigger: 'continueButton' // Fortsätt när alla problem är gjorda (eller baserat på assessment)
      },
       // --- Steg 4: Lösa med Addition (för Subtraktion) ---
      {
        id: 'steg4-addition',
        title: 'Lösa med Addition',
        content: [
           {
            id: 's4c1-text',
            contentType: 'text',
            text: 'Nu tittar vi på ekvationer där ett tal subtraheras från variabeln, till exempel `y - 5 = 2`.',
            nextAction: 'continueButton'
          } satisfies TextContent,
           {
            id: 's4c2-vis-start',
            contentType: 'visualization',
            text: 'Visualisering av y - 5 = 2',
            config: {
                active: true,
                leftSide: 'y - 5',
                rightSide: '2',
                xValue: 7, // Byter variabelnamn och värde för exemplet
                showEvaluation: true
            } satisfies VisEquationBalanceConfig
          },
          {
            id: 's4c3-text',
            contentType: 'text',
            text: 'För att få `y` ensamt på vänster sida måste vi bli av med `- 5`. Motsatsen (inversen) till subtraktion är **addition**. Vi måste alltså addera 5.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's4c4-text',
            contentType: 'text',
            text: 'Kom ihåg regeln: Gör samma sak på båda sidor! Vi adderar 5 till både vänster och höger sida.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's4c5-vis-steg1',
            contentType: 'visualization',
            text: 'Visar addition på båda sidor',
            config: {
                operation: { type: 'add', value: 5 },
                leftSide: 'y - 5',
                rightSide: '2',
                xValue: 7 // Fortfarande y=7
            } satisfies VisEquationBalanceConfig
          },
           {
            id: 's4c6-text',
            contentType: 'text',
            text: 'Ekvationen blir: `y - 5 + 5 = 2 + 5`. Förenkla nu båda sidor.',
            nextAction: 'continueButton'
          } satisfies TextContent,
          {
            id: 's4c7-vis-resultat',
            contentType: 'visualization',
            text: 'Resultatet efter addition',
            config: {
                leftSide: 'y',
                rightSide: '7',
                xValue: 7,
                 showEvaluation: true
            } satisfies VisEquationBalanceConfig
          },
           {
            id: 's4c8-text',
            contentType: 'text',
            text: 'Perfekt! Vågen är i balans och vi ser att `y = 7`.',
            nextAction: 'continueButton'
          } satisfies TextContent,
        ],
         completionTrigger: 'continueButton'
      },
       // --- Steg 5: Övning (Addition) ---
      {
        id: 'steg5-ovning-addition',
        title: 'Övning (Lösa med Addition)',
        content: [
          {
            id: 's5c1-text',
            contentType: 'text',
            text: 'Dags att öva på att använda addition för att lösa ekvationer.',
          } satisfies TextContent,
          {
            id: 's5p1-problem',
            contentType: 'mathProblem',
            problem: 'z - 6 = 2',
            nextAction: 'continueButton'
          } satisfies MathProblemContent,
          {
            id: 's5p2-problem',
            contentType: 'mathProblem',
            problem: 'p - 1 = 10',
            nextAction: 'continueButton'
          } satisfies MathProblemContent,
           {
            id: 's5p3-problem',
            contentType: 'mathProblem',
            problem: 'm - 7 = -3', // Med negativa tal
            nextAction: 'continueButton'
          } satisfies MathProblemContent
        ],
        completionTrigger: 'continueButton'
      },
      // --- Steg 6: Sammanfattning ---
      {
        id: 'steg6-sammanfattning',
        title: 'Sammanfattning',
        content: [
           {
            id: 's6c1-text',
            contentType: 'text',
            text: 'Bra jobbat! Du har nu lärt dig grunderna i att lösa enstegsekvationer:\n1. Identifiera vilken operation (addition eller subtraktion) som utförs på variabeln.\n2. Utför **motsatt (invers) operation** på **båda sidor** av likhetstecknet för att isolera variabeln.\n3. Förenkla för att hitta variabelns värde.',
             nextAction: 'continueButton'
           } satisfies TextContent,
             {
            id: 's6c2-text',
            contentType: 'text',
            text: 'Detta är en grundläggande men mycket viktig färdighet inom algebra!',
            // Ingen nextAction, detta är slutet på innehållet
          } satisfies TextContent,
        ],
        completionTrigger: 'continueButton' // Markerar slutet på hela LearnLine
      }
    ]
  }
];