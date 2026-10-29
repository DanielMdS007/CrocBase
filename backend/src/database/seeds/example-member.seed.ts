import { DataSource } from 'typeorm';
import { Membro } from '../../modules/membros/entities/membro.entity.js';
import { Cargo } from '../../authorization/enums/cargo.enum.js';

export async function seedExampleMember(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(Membro);
  const existingMember = await repository.findOne({
    where: { Cargo: Cargo.MEMBRO },
    select: { idMembro: true },
  });

  if (existingMember) {
    console.log(`Seed ignorada: já existe um membro (id ${existingMember.idMembro}).`);
    return;
  }

  const member = repository.create({ Cargo: Cargo.MEMBRO });
  const savedMember = await repository.save(member);
  console.log(`Membro de exemplo criado com id ${savedMember.idMembro}.`);
}
