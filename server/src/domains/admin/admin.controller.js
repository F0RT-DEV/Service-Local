import ProviderModel from './admin.model.js';

export async function approveProvider(req, res) {
  try {
    const { id } = req.params;

    const provider = await ProviderModel.findById(id);
    if (!provider) return res.status(404).json({ message: 'Prestador não encontrado' });

    await ProviderModel.updateStatus(id, 'approved');

    return res.status(200).json({ message: 'Prestador aprovado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
export async function rejectProvider(req, res) {
 try {
    const { id } = req.params;

    const provider = await ProviderModel.findById(id);
    if (!provider) return res.status(404).json({ message: 'Prestador não encontrado' });

    await ProviderModel.updateStatus(id, 'rejected');

    return res.status(200).json({ message: 'Prestador rejeitado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
export async function getPendingProviders(req, res) {
  try {
    const pendingProviders = await ProviderModel.findPending();
    return res.status(200).json(pendingProviders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
export async function getApprovedProviders(req, res) {
  try {
    const approvedProviders = await ProviderModel.findApproved();
    return res.status(200).json(approvedProviders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
export async function readUsers(req, res) {
  try {
    const users = await ProviderModel.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
